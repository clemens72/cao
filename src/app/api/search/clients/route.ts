import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOrganizationName } from "@/lib/utils";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
        return NextResponse.json({ persons: [], organizationPersons: [] });
    }

    try {
        // Search persons
        const persons = await prisma.person.findMany({
            where: {
                OR: [
                    {
                        firstName: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastName: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            select: {
                entityId: true,
                firstName: true,
                lastName: true
            },
            take: 50
        });

        // Get entityIds from found persons
        const personEntityIds = persons.map(p => p.entityId);

        // Search organizationPersons matching those persons
        const organizationPersons = await prisma.organizationPerson.findMany({
            where: {
                personEntityId: {
                    in: personEntityIds
                }
            },
            select: {
                id: true,
                organizationEntityId: true,
                personEntityId: true,
            },
            take: 50
        });

        // Transform organizationPersons data
        const transformedOrgPersons = await Promise.all(
            organizationPersons.map(async (op) => ({
                id: op.id,
                organizationEntityId: op.organizationEntityId,
                personEntityId: op.personEntityId,
                organizationName: await getOrganizationName(op.organizationEntityId),
                personFirstName: persons.find(p => p.entityId === op.personEntityId)?.firstName || "",
                personLastName: persons.find(p => p.entityId === op.personEntityId)?.lastName || ""
            }))
        );

        return NextResponse.json({
            persons,
            organizationPersons: transformedOrgPersons
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: "Failed to search clients" },
            { status: 500 }
        );
    }
}

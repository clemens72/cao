import { redirect } from 'next/navigation'

const EntertainerRedirectPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await params;
    redirect(`/list/products/${id}`)
}

export default EntertainerRedirectPage

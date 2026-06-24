import PageEditor from "../../../../components/PageEditor";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPageAdminPage({ params }: Props) {
  const { id } = await params;
  return <PageEditor id={id} />;
}

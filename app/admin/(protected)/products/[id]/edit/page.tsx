import ProductEditor from "../../../../components/ProductEditor";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductAdminPage({ params }: Props) {
  const { id } = await params;
  return <ProductEditor id={id} />;
}

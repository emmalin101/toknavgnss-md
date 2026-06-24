import BlogEditor from "../../../../components/BlogEditor";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogAdminPage({ params }: Props) {
  const { id } = await params;
  return <BlogEditor id={id} />;
}

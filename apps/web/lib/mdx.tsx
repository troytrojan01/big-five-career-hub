import { compileMDX } from "next-mdx-remote/rsc";

export async function renderMdx<TFrontmatter>(source: string) {
  return compileMDX<TFrontmatter>({
    source,
    options: {
      parseFrontmatter: false,
    },
  });
}

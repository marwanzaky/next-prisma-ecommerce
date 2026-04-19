import { AuthGuard } from "@/components/auth/auth-guard";

export default function AdminCategoriesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AuthGuard>{children}</AuthGuard>;
}

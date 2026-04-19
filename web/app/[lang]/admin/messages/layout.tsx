import { AuthGuard } from "@/components/auth/auth-guard";

export default function AdminMessagesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AuthGuard>{children}</AuthGuard>;
}

interface Props {
  children: React.ReactNode;
}

/**
 * ParentLayout component
 * @author Kenneth Sumang
 */
export default function Layout({ children }: Props) {
  return <>{children}</>;
}
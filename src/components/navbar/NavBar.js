import Search from "../Search/Search";
import Logo from "../Logo/Logo";
import NumResults from "../NumResults/NumResults";

export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

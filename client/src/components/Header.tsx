import logo from "../assets/Logo.avif"; // adjust path/filename as needed

const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex items-center">
      <img src={logo} alt="App Logo" className="h-8 w-auto ml-12" />
    </header>
  );
};

export default Header;

import { Button } from "@/components/ui/button";
import Image from "next/image";

const Header = () => {
  return (
    <header className="flex justify-between items-center w-full py-6 px-20">
      <div className="flex items-center space-x-2 mb-5">
        <Image
          src="/logo.svg"
          alt="user"
          width={32}
          height={32}
          className="rounded-none border-black"
        />
        <span className="text-white text-3xl font-semibold">Axle</span>
      </div>
      <nav className="flex items-center space-x-10 text-white/50 font-medium text-lg">
        <a href="#" className="hover:text-green-400 transition-colors">
          Docs
        </a>
        <a href="#" className="hover:text-green-400 transition-colors">
          Features
        </a>
        <a href="#" className="hover:text-green-400 transition-colors">
          Pricing
        </a>
        <Button className="bg-green-500 text-white font-semibold rounded-full px-10 py-5 hover:bg-green-400 transition-all">
          Check it out
        </Button>
      </nav>
    </header>
  );
};

export default Header; 

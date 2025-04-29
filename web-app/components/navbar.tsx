"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, Plus, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">QF</span>
            </div>
            <span className="font-semibold text-lg">Q Finder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-900">
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-gray-900 p-0 h-auto gap-1"
                >
                  Features <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Feature 1</DropdownMenuItem>
                <DropdownMenuItem>Feature 2</DropdownMenuItem>
                <DropdownMenuItem>Feature 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/" className="text-sm font-medium text-gray-900">
              Pricing
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-gray-900 p-0 h-auto gap-1"
                >
                  Resources <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Tutorials</DropdownMenuItem>
                <DropdownMenuItem>Blog</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/" className="text-sm font-medium text-gray-900">
              About
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/create">
              <Button
                variant="secondary"
                className="text-sm font-medium bg-black text-white hover:bg-gray-800 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Crea una pregunta
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t border-gray-100">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-sm font-medium text-gray-900">
              Home
            </Link>
            <Link href="/" className="text-sm font-medium text-gray-900">
              Features
            </Link>
            <Link href="/" className="text-sm font-medium text-gray-900">
              Pricing
            </Link>
            <Link href="/" className="text-sm font-medium text-gray-900">
              Resources
            </Link>
            <Link href="/" className="text-sm font-medium text-gray-900">
              About
            </Link>
          </nav>
          <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="text-sm font-medium justify-start"
            >
              Log in
            </Button>
            <Button className="text-sm font-medium bg-black text-white hover:bg-gray-800">
              Get started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

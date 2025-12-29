'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black py-16 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
                <div className="col-span-2 md:col-span-1">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <Image src="/logo.svg" alt="Axle" width={32} height={32} />
                        <span className="font-bold text-xl text-white">Axle</span>
                    </Link>
                    <p className="text-neutral-500 text-sm mb-6">
                        The intelligent agent platform for modern engineering teams.
                    </p>
                    <div className="flex gap-4">
                        {/* Social placeholders */}
                        <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10" />
                        <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10" />
                        <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10" />
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Product</h4>
                    <ul className="space-y-4 text-sm text-neutral-400">
                        <li><Link href="#" className="hover:text-green-400">Features</Link></li>
                        <li><Link href="#" className="hover:text-green-400">Integrations</Link></li>
                        <li><Link href="#" className="hover:text-green-400">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-green-400">Changelog</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Resources</h4>
                    <ul className="space-y-4 text-sm text-neutral-400">
                        <li><Link href="#" className="hover:text-green-400">Documentation</Link></li>
                        <li><Link href="#" className="hover:text-green-400">API Reference</Link></li>
                        <li><Link href="#" className="hover:text-green-400">Community</Link></li>
                        <li><Link href="#" className="hover:text-green-400">Blog</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-neutral-400">
                        <li><Link href="#" className="hover:text-green-400">About</Link></li>
                        <li><Link href="#" className="hover:text-green-400">Careers</Link></li>
                        <li><Link href="#" className="hover:text-green-400">Privacy</Link></li>
                        <li><Link href="#" className="hover:text-green-400">Terms</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-600">
                <p>© 2025 Axle Inc. All rights reserved.</p>
                <div className="flex gap-8">
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}

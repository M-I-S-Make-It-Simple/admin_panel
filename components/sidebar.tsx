"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  const groupedLinks = [
    {
      title: "📊 Загальне",
      links: [
        { href: "/dashboard", label: "Dashboard" },
      ],
    },
    {
      title: "📰 Контент",
      links: [
        { href: "/news", label: "Новини" },
        { href: "/staff", label: "Вчителі" },
      ],
    },
    {
      title: "🔗 Посилання",
      links: [
        { href: "/links", label: "Всі посилання" },
        { href: "/links/education", label: "Освітній процес" },
        { href: "/links/subjects", label: "За предметами" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      {groupedLinks.map((group) => (
        <div key={group.title} className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{group.title}</h3>
          <ul className="space-y-1">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "block px-2 py-1 rounded hover:bg-gray-100",
                    pathname === link.href && "font-bold text-blue-600"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

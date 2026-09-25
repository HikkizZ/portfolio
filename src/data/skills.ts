/**
 * Stack agrupado por área (ver 02_diseno §3.1 "03 Stack" y 03_contenido.md).
 * Sin barras de porcentaje ni niveles.
 */

interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Lenguajes",
    items: ["TypeScript", "JavaScript", "Python"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express", "APIs REST", "JWT", "OAuth2/OIDC", "TypeORM", "Zod"],
  },
  {
    label: "Frontend",
    items: ["React", "TanStack Query/Router", "Next.js", "Vue.js", "Tailwind CSS"],
  },
  {
    label: "Datos",
    items: ["PostgreSQL", "SQL Server", "MySQL"],
  },
  {
    label: "Infra y testing",
    items: ["Docker", "nginx", "Linux", "Git", "PM2", "Vitest", "Supertest", "Mocha", "Chai"],
  },
];

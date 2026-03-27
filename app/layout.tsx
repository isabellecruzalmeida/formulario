import React from 'react';

export const metadata = {
  title: 'Formulário do Candidato',
  description: 'Avaliação de Perfil',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}

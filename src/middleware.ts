import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login'
  }
});

export const config = {
  matcher: [
    // Adicione aqui as rotas que precisam de autenticação
    // '/dashboard/:path*',
    // '/profile/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|$).*)'
  ]
};

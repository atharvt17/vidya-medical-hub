
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if this is a page reload and we're not on allowed pages
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isPageReload = navigationEntries.length > 0 && navigationEntries[0].type === 'reload';
    
    const allowedPagesOnReload = ['/', '/login', '/signup'];
    const currentPath = location.pathname;
    
    if (isPageReload && !allowedPagesOnReload.includes(currentPath)) {
      console.log('Page reload detected on:', currentPath, 'redirecting to homepage');
      navigate('/', { replace: true });
      return;
    }

    // Check if products are in session storage, if not and we're not on homepage, redirect
    const storedProducts = sessionStorage.getItem('vidya_medical_products');
    if (!storedProducts && currentPath !== '/' && !allowedPagesOnReload.includes(currentPath)) {
      console.log('No products in session storage, redirecting to homepage');
      navigate('/', { replace: true });
    }
  }, [navigate, location.pathname]);

  return <>{children}</>;
};

export default RouteGuard;

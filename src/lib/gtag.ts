export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Registra uma visualização de página
export const pageview = (url: string) => {
  window.gtag?.('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Registra eventos personalizados
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value: number;
}) => {
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}; 

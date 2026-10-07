import logoUrl from '../../../assets/logo/parkflow-logo.svg';

export function Logo({ largura = 176 }: { largura?: number }) {
  return (
    <img
      src={logoUrl}
      alt="ParkFlow — Encontre. Estacione. Siga."
      width={largura}
      height={Math.round((largura * 180) / 680)}
      className="logo"
    />
  );
}

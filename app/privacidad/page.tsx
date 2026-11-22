import type { Metadata } from "next";
import { site } from "@/lib/site";
import PageHead from "@/components/empresa/PageHead";

export const metadata: Metadata = {
  title: "Política de privacidad y cookies",
  description: "Cómo Ibarra Insumos trata tus datos personales y qué cookies usa el sitio.",
  alternates: { canonical: "/privacidad" },
};

const secciones = [
  { t: "Qué datos usamos", d: "Solo los que nos mandás vos al pedir una cotización o escribirnos (nombre, empresa, teléfono, e-mail, zona de entrega y los productos que pedís). Tu lista de cotización se guarda en tu navegador y no llega a nuestros servidores hasta que la enviás por WhatsApp o e-mail." },
  { t: "Para qué los usamos", d: "Para responder tu consulta, armar la cotización, facturar y coordinar la entrega. No vendemos ni cedemos tus datos a terceros." },
  { t: "Cookies de medición y publicidad", d: "Si las aceptás, usamos Google Analytics, Google Ads y Meta para medir visitas y mejorar nuestros anuncios. Sin tu consentimiento no se activan. Podés cambiar tu elección desde el aviso de cookies o borrando las cookies del navegador." },
  { t: "Tus derechos", d: "Podés pedir acceso, rectificación o eliminación de tus datos en cualquier momento escribiendo a " + site.email + ". La Agencia de Acceso a la Información Pública es el órgano de control de la Ley 25.326 de Protección de Datos Personales." },
];

export default function Page() {
  return (
    <>
      <PageHead crumb="Privacidad" title="Política de privacidad y cookies" sub="Qué datos usamos, para qué y cómo podés gestionarlos." />
      <section className="section">
        <div className="wrap policy" style={{ maxWidth: 820 }}>
          {secciones.map((s) => <div key={s.t}><h2>{s.t}</h2><p>{s.d}</p></div>)}
          <p className="note">Responsable: {site.name}, {site.address.locality}, CABA. Contacto: {site.email}.</p>
        </div>
      </section>
    </>
  );
}

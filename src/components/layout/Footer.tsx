import type { SiteSettings } from '@/types/sanity'
import NewsletterForm from './NewsletterForm'

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const year = new Date().getFullYear()
  const name = settings?.propertyName ?? 'Barnängshuset'
  const address = settings?.address ?? 'Nackagatan 4, 116 40 Stockholm'

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container">
        <p className="footer__invite">
          {settings?.footerInvite ?? 'Work somewhere worth coming back to.'}
        </p>

        <div className="footer__ledger">
          {/* Contact */}
          <div className="footer__col">
            <p className="footer__col-label">Contact</p>
            <ul>
              {settings?.leasingContact?.name && (
                <li><span>{settings.leasingContact.name}</span></li>
              )}
              {settings?.leasingContact?.email && (
                <li>
                  <a href={`mailto:${settings.leasingContact.email}`}>
                    {settings.leasingContact.email}
                  </a>
                </li>
              )}
              {settings?.leasingContact?.phone && (
                <li>
                  <a href={`tel:${settings.leasingContact.phone.replace(/\s/g, '')}`}>
                    {settings.leasingContact.phone}
                  </a>
                </li>
              )}
              {address && <li><span>{address}</span></li>}
            </ul>
          </div>

          {/* Sitemap */}
          <div className="footer__col">
            <p className="footer__col-label">Navigate</p>
            <ul>
              <li><a href="#spaces">Spaces</a></li>
              <li><a href="#building">Building</a></li>
              <li><a href="#neighbourhood">Neighbourhood</a></li>
              <li><a href="#journal">Journal</a></li>
              <li><a href="#viewing">Arrange a viewing</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer__col">
            <p className="footer__col-label">Follow</p>
            <ul>
              {settings?.socialLinks?.map((link) => (
                <li key={link.platform}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.platform}
                  </a>
                </li>
              ))}
              {!settings?.socialLinks?.length && (
                <li><span style={{ opacity: 0.4 }}>Coming soon</span></li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer__col">
            <p className="footer__col-label">Updates</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} {name}</span>
          <span>Nackagatan 4 · Södermalm · Stockholm</span>
        </div>
      </div>
    </footer>
  )
}

import SideNavIcon from './SideNavIcon'

const SideNav = ({ links, lastLink, main }) => (
  <div className={`side-nav-wrapper ${main ? 'root-side-nav' : ''}`}>
    <div>
      {links.map((link) => (
        <SideNavIcon key={link.path} link={link} />
      ))}
    </div>

    {lastLink && <SideNavIcon link={lastLink} />}
  </div>
)

export default SideNav

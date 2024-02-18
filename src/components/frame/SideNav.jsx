import SideNavIcon from './SideNavIcon'

const SideNav = ({ links, lastLink }) => (
  <div className='side-nav-wrapper'>
    <div>
      {links.map((link) => (
        <SideNavIcon key={link.path} link={link} />
      ))}
    </div>

    {lastLink && <SideNavIcon link={lastLink} />}
  </div>
)

export default SideNav

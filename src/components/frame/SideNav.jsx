/* eslint-disable react/prop-types */
import SideNavIcon from './SideNavIcon'
import { SideNavContainer, SideNavList } from '../../rootStyledComponents'

const SideNav = ({ links, lastLink }) => (
  <SideNavContainer>
    <SideNavList>
      {links.map((link) => (
        <SideNavIcon key={link.path} link={link} />
      ))}
    </SideNavList>

    {lastLink && <SideNavIcon link={lastLink} />}
  </SideNavContainer>
)

export default SideNav

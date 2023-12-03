/* eslint-disable react/prop-types */
import SideNavIcon from './SideNavIcon'
import { SideNavContainer, SideNavList } from '../../styled'

const SideNav = ({ links, lastLink }) => {
  return (
    <SideNavContainer>
      <SideNavList>
        {links.map((link, index) => {
          return <SideNavIcon key={index} link={link} />
        })}
      </SideNavList>

      {lastLink && <SideNavIcon link={lastLink} />}
    </SideNavContainer>
  )
}

export default SideNav

import {
  BadgePercentIcon,
  BriefCaseIcon,
  ChartBarIcon,
  ClipboardListIcon,
  CoinsStackedIcon,
  FileInOutIcon,
  GalaxyIcon,
  HandshakeIcon,
  HomeIcon,
  HorizontalSlidersIcon,
  MoneySackIcon,
  MoneySackWithHandIcon,
  NpBankIcon,
  PiggyBankIcon,
  ScrollIcon,
  SignoutIcon,
  TireIcon,
  UserCancelIcon,
  UserCheckIcon,
  UserCogIcon,
  UserGroupIcon,
  UsersIcon,
} from '@/components/Icons'
import { useBodyScrollLock } from '@/hooks'
import { useSidebar } from '@/routes/_dashboard/-components/SidebarContext'
import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import styles from './DashboardSidebar.module.scss'
import { LogoutModal } from './LogoutModal'

type NavItem =
  | {
      kind: 'link'
      label: string
      icon: typeof UsersIcon
      to: '/users' | '/auth/login'
    }
  | {
      kind: 'static'
      label: string
      icon: typeof UsersIcon
    }

type NavGroup = {
  label: string
  items: NavItem[]
}

const sidebarGroups: NavGroup[] = [
  {
    label: 'Customers',
    items: [
      { kind: 'link', label: 'Users', icon: UsersIcon, to: '/users' },
      { kind: 'static', label: 'Guarantors', icon: UserGroupIcon },
      { kind: 'static', label: 'Loans', icon: MoneySackIcon },
      { kind: 'static', label: 'Decision Models', icon: HandshakeIcon },
      { kind: 'static', label: 'Savings', icon: PiggyBankIcon },
      { kind: 'static', label: 'Loan Requests', icon: MoneySackWithHandIcon },
      { kind: 'static', label: 'Whitelist', icon: UserCheckIcon },
      { kind: 'static', label: 'Karma', icon: UserCancelIcon },
    ],
  },
  {
    label: 'Businesses',
    items: [
      { kind: 'static', label: 'Organization', icon: BriefCaseIcon },
      { kind: 'static', label: 'Loan Products', icon: MoneySackWithHandIcon },
      { kind: 'static', label: 'Savings Products', icon: NpBankIcon },
      { kind: 'static', label: 'Fees and Charges', icon: CoinsStackedIcon },
      { kind: 'static', label: 'Transactions', icon: FileInOutIcon },
      { kind: 'static', label: 'Services', icon: GalaxyIcon },
      { kind: 'static', label: 'Service Account', icon: UserCogIcon },
      { kind: 'static', label: 'Settlements', icon: ScrollIcon },
      { kind: 'static', label: 'Reports', icon: ChartBarIcon },
    ],
  },
  {
    label: 'Settings',
    items: [
      { kind: 'static', label: 'Preferences', icon: HorizontalSlidersIcon },
      { kind: 'static', label: 'Fees and Pricing', icon: BadgePercentIcon },
      { kind: 'static', label: 'Audit Logs', icon: ClipboardListIcon },
      { kind: 'static', label: 'Systems Messages', icon: TireIcon },
    ],
  },
]

export function DashboardSidebar() {
  const { isOpen, close } = useSidebar()

  useBodyScrollLock(isOpen)

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={close}
        aria-hidden="true"
      />
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
        aria-label="Dashboard sidebar"
      >
        <div className={styles.scrollArea}>
          <div className={styles.switchOrg}>
            <BriefCaseIcon
              className={styles.switchOrgIcon}
              aria-hidden="true"
            />
            <span className={styles.switchOrgText}>Switch Organization</span>
            <ChevronDown className={styles.switchOrgCaret} aria-hidden="true" />
          </div>

          <nav className={styles.nav} aria-label="Dashboard navigation">
            <div className={styles.navItem}>
              <HomeIcon className={styles.navIcon} aria-hidden="true" />
              <span className={styles.navLabel}>Dashboard</span>
            </div>

            {sidebarGroups.map((group) => (
              <section className={styles.group} key={group.label}>
                <h2 className={styles.groupTitle}>{group.label}</h2>
                <ul className={styles.groupList}>
                  {group.items.map((item) => (
                    <li key={item.label}>
                      {item.kind === 'link' ? (
                        <Link
                          to={item.to}
                          className={styles.navItem}
                          activeProps={{ className: styles.navItemActive }}
                          onClick={close}
                        >
                          <item.icon
                            className={styles.navIcon}
                            aria-hidden="true"
                          />
                          <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                      ) : (
                        <button type="button" className={styles.navItemStatic}>
                          <item.icon
                            className={styles.navIcon}
                            aria-hidden="true"
                          />
                          <span className={styles.navLabel}>{item.label}</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>

        <div className={styles.footer}>
          <LogoutModal>
            <button type="button" className={styles.logout}>
              <SignoutIcon className={styles.logoutIcon} aria-hidden="true" />
              <span>Logout</span>
            </button>
          </LogoutModal>
          <div className={styles.version}>v1.2.0</div>
        </div>
      </aside>
    </>
  )
}

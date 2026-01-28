import { Button } from '@/components/Button'
import { ErrorState } from '@/components/ErrorState'
import { NpChevronIcon, StarFillIcon, StarIcon } from '@/components/Icons'
import { Skeleton } from '@/components/Skeleton'
import { updateUserStatusMutationOptions, userQueryOptions } from '@/lib/query'
import { UserStatusModal } from '@/routes/_dashboard/-components/UserStatusModal'
import {
  actionToStatus,
  formatCurrencyNGN,
  formatNumber,
  getAvailableActions,
  type UserStatusAction,
} from '@/utils'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import styles from './users.$userId.module.scss'

export const Route = createFileRoute('/_dashboard/users/$userId')({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(userQueryOptions(params.userId)),
  pendingComponent: () => (
    <div className={styles.page}>
      <Skeleton heightInPx={40} widthInPx={150} />

      <div className={styles.pageHeader}>
        <Skeleton heightInPx={40} widthInPx={150} />
        <div className={styles.pageActions}>
          <Skeleton heightInPx={40} widthInPx={150} />
          <Skeleton heightInPx={40} widthInPx={150} />
        </div>
      </div>

      <Skeleton heightInPx={200} />
      <Skeleton heightInPx={600} />
    </div>
  ),
  errorComponent: () => (
    <div className={styles.page}>
      <ErrorState variant="notFound" showRetry={false} showBackToUsers={true} />
    </div>
  ),
})

type TabKey =
  | 'general'
  | 'documents'
  | 'bank'
  | 'loans'
  | 'savings'
  | 'appAndSystem'

function userRefFromId(id: string) {
  const suffix = id.slice(-4).toUpperCase()
  return `LSQF${suffix}g90`
}

function Stars({ value }: { value: 1 | 2 | 3 }) {
  return (
    <div className={styles.stars} aria-label={`User tier: ${value} out of 3`}>
      {[1, 2, 3].map((i) =>
        i <= value ? (
          <StarFillIcon
            className={styles.starActive}
            key={i}
            aria-hidden="true"
          />
        ) : (
          <StarIcon className={styles.star} key={i} aria-hidden="true" />
        ),
      )}
    </div>
  )
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.kv}>
      <div className={styles.kLabel}>{label}</div>
      <div className={styles.kValue}>{value}</div>
    </div>
  )
}

function RouteComponent() {
  const { userId } = Route.useParams()
  const { data: user } = useSuspenseQuery(userQueryOptions(userId))
  const [tab, setTab] = useState<TabKey>('general')
  const [pendingAction, setPendingAction] = useState<UserStatusAction | null>(
    null,
  )

  const updateStatus = useMutation(updateUserStatusMutationOptions)

  const availableActions = getAvailableActions(user.status)

  const handleConfirm = () => {
    if (!pendingAction) return
    const newStatus = actionToStatus(pendingAction)
    updateStatus.mutate(
      { userId: user.id, status: newStatus },
      { onSettled: () => setPendingAction(null) },
    )
  }

  const incomeRange = `${formatCurrencyNGN(user.educationAndEmployment.monthlyIncome[0])} - ${formatCurrencyNGN(user.educationAndEmployment.monthlyIncome[1])}`

  return (
    <div className={styles.page}>
      <Link to="/users" type="button" className={styles.backButton}>
        <NpChevronIcon aria-hidden="true" />
        Back to Users
      </Link>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>User Details</h1>
        <div className={styles.pageActions}>
          {availableActions.includes('inactivate') && (
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => setPendingAction('inactivate')}
            >
              Inactivate User
            </Button>
          )}
          {availableActions.includes('blacklist') && (
            <Button
              variant={'outline-destructive'}
              size={'sm'}
              onClick={() => setPendingAction('blacklist')}
            >
              Blacklist User
            </Button>
          )}
          {availableActions.includes('activate') && (
            <Button
              variant={'outline-primary'}
              size={'sm'}
              onClick={() => setPendingAction('activate')}
            >
              Activate User
            </Button>
          )}
        </div>
      </div>

      <UserStatusModal
        userName={user.profile.fullName}
        action={pendingAction ?? 'activate'}
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
        onConfirm={handleConfirm}
        isLoading={updateStatus.isPending}
      />

      <section className={styles.profileCard} aria-label="User summary">
        <div className={styles.profileTop}>
          <div className={styles.profileIdentity}>
            <div className={styles.avatar} aria-hidden="true">
              <UserIcon />
            </div>
            <div className={styles.identityText}>
              <div className={styles.fullName}>{user.profile.fullName}</div>
              <div className={styles.userRef}>{userRefFromId(user.id)}</div>
            </div>
          </div>

          <div className={styles.profileDivider} aria-hidden="true" />

          <div className={styles.tier}>
            <div className={styles.tierLabel}>User's Tier</div>
            <Stars value={user.tier as 1 | 2 | 3} />
          </div>

          <div className={styles.profileDivider} aria-hidden="true" />

          <div className={styles.account}>
            <div className={styles.balance}>
              {formatCurrencyNGN(user.accountSummary.balance)}
            </div>
            <div className={styles.accountMeta}>
              {user.accountSummary.accountNumber}/{user.accountSummary.bankName}
            </div>
          </div>
        </div>

        <nav className={styles.tabs} aria-label="User details tabs">
          <button
            type="button"
            className={`${styles.tab} ${tab === 'general' ? styles.tabActive : ''}`}
            onClick={() => setTab('general')}
          >
            General Details
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === 'documents' ? styles.tabActive : ''}`}
            onClick={() => setTab('documents')}
          >
            Documents
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === 'bank' ? styles.tabActive : ''}`}
            onClick={() => setTab('bank')}
          >
            Bank Details
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === 'loans' ? styles.tabActive : ''}`}
            onClick={() => setTab('loans')}
          >
            Loans
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === 'savings' ? styles.tabActive : ''}`}
            onClick={() => setTab('savings')}
          >
            Savings
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === 'appAndSystem' ? styles.tabActive : ''}`}
            onClick={() => setTab('appAndSystem')}
          >
            App and System
          </button>
        </nav>
      </section>

      {tab !== 'general' ? (
        <section className={styles.detailsCard} aria-label="Tab content">
          <h2 className={styles.sectionTitle}>Coming soon</h2>
          <p className={styles.mutedText}>
            This tab is not required for the current mock-data flow.
          </p>
        </section>
      ) : (
        <section className={styles.detailsCard} aria-label="General details">
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            <div className={styles.grid5}>
              <KV label="Full Name" value={user.profile.fullName} />
              <KV label="Phone Number" value={user.phoneNumber} />
              <KV label="Email Address" value={user.email} />
              <KV label="BVN" value={user.profile.bvn} />
              <KV label="Gender" value={user.profile.gender} />
              <KV label="Marital Status" value={user.profile.maritalStatus} />
              <KV label="Children" value={user.profile.children} />
              <KV
                label="Type of Residence"
                value={user.profile.typeOfResidence}
              />
            </div>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Education and Employment</h2>
            <div className={styles.grid4}>
              <KV
                label="Level of Education"
                value={user.educationAndEmployment.levelOfEducation}
              />
              <KV
                label="Employment Status"
                value={user.educationAndEmployment.employmentStatus}
              />
              <KV
                label="Sector of Employment"
                value={user.educationAndEmployment.sectorOfEmployment}
              />
              <KV
                label="Duration of Employment"
                value={user.educationAndEmployment.durationOfEmployment}
              />
              <KV
                label="Office Email"
                value={user.educationAndEmployment.officeEmail}
              />
              <KV label="Monthly Income" value={incomeRange} />
              <KV
                label="Loan Repayment"
                value={formatNumber(user.educationAndEmployment.loanRepayment)}
              />
            </div>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Socials</h2>
            <div className={styles.grid5}>
              <KV label="Twitter" value={user.socials.twitter} />
              <KV label="Facebook" value={user.socials.facebook} />
              <KV label="Instagram" value={user.socials.instagram} />
            </div>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Guarantor</h2>
            <div className={styles.guarantors}>
              {user.guarantors.map((g, idx) => (
                <div key={`${g.email}-${idx}`} className={styles.guarantorRow}>
                  <KV label="Full Name" value={g.fullName} />
                  <KV label="Phone Number" value={g.phoneNumber} />
                  <KV label="Email Address" value={g.email} />
                  <KV label="Relationship" value={g.relationship} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

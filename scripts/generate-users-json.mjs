import { writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

const pad = (n, len = 4) => String(n).padStart(len, '0')

const organizations = ['Lendsqr', 'Irorun', 'Lendstar', 'Lendbox', 'Paylater']
const statuses = ['Active', 'Inactive', 'Pending', 'Blacklisted']
const genders = ['Male', 'Female']
const maritalStatuses = ['Single', 'Married', 'Divorced']
const residenceTypes = [
  'Parent’s Apartment',
  'Rented Apartment',
  'Owned Apartment',
  'Company Provided',
]
const educationLevels = ['B.Sc', 'M.Sc', 'HND', 'OND']
const employmentStatuses = ['Employed', 'Unemployed', 'Self-employed']
const sectors = ['FinTech', 'Retail', 'Health', 'Education', 'Construction', 'Energy']
const banks = ['Providus Bank', 'GTBank', 'Access Bank', 'Zenith Bank', 'UBA']

const firstNames = [
  'Grace',
  'Tosin',
  'Debby',
  'Ade',
  'Chinedu',
  'Aisha',
  'Ife',
  'Samuel',
  'John',
  'Amaka',
  'Peter',
  'Chioma',
  'Seyi',
  'Kemi',
  'Bola',
  'Ola',
  'Zainab',
]
const lastNames = [
  'Effiom',
  'Dokunmu',
  'Ogana',
  'Adebayo',
  'Okafor',
  'Yusuf',
  'Eze',
  'Balogun',
  'Okoro',
  'Ibrahim',
  'Adeyemi',
  'Nwankwo',
  'Sule',
  'Udo',
  'Bassey',
]

function pick(arr, n) {
  return arr[n % arr.length]
}

function digitsFrom(n, len) {
  // Deterministic numeric string
  const base = String((n * 9301 + 49297) % 233280)
  return (base.repeat(Math.ceil(len / base.length))).slice(0, len)
}

function isoDateFrom(i) {
  // Spread across 2020-2022
  const year = 2020 + (i % 3)
  const month = ((i % 12) + 1).toString().padStart(2, '0')
  const day = (((i * 7) % 28) + 1).toString().padStart(2, '0')
  const hour = ((10 + (i % 8)) % 24).toString().padStart(2, '0')
  const min = ((i * 11) % 60).toString().padStart(2, '0')
  return `${year}-${month}-${day}T${hour}:${min}:00.000Z`
}

function amountFrom(i, min, max, step = 5000) {
  const span = max - min
  const raw = (i * 7919) % Math.floor(span / step)
  return min + raw * step
}

function makeUser(i) {
  const first = pick(firstNames, i)
  const last = pick(lastNames, i * 3)
  const fullName = `${first} ${last}`

  const org = pick(organizations, i * 5)
  const status = pick(statuses, i * 7)

  const username = `${first.toLowerCase()}${last.toLowerCase()}`.slice(0, 12)
  const email = `${username}${i % 7 === 0 ? '' : i}@${org.toLowerCase()}.com`
  const phoneNumber = `0${digitsFrom(i + 19, 10)}`

  const tier = (i % 3) + 1
  const bankName = pick(banks, i * 2)
  const accountNumber = digitsFrom(i + 101, 10)
  const balance = amountFrom(i, 5000, 5000000, 2500)

  const gender = pick(genders, i)
  const maritalStatus = pick(maritalStatuses, i)
  const typeOfResidence = pick(residenceTypes, i)
  const bvn = digitsFrom(i + 303, 11)

  const level = pick(educationLevels, i)
  const employmentStatus = pick(employmentStatuses, i)
  const sector = pick(sectors, i)
  const durationYears = (i % 9) + 1
  const duration = `${durationYears} year${durationYears === 1 ? '' : 's'}`
  const officeEmail = `${first.toLowerCase()}.${last.toLowerCase()}@${org.toLowerCase()}.com`
  const minIncome = amountFrom(i, 20000, 800000, 5000)
  const maxIncome = minIncome + amountFrom(i + 11, 50000, 600000, 5000)
  const loanRepayment = Math.max(5000, Math.floor(minIncome / 5 / 1000) * 1000)

  const socials = {
    twitter: `@${username}`,
    facebook: fullName,
    instagram: `@${username}`,
  }

  const guarantor1First = pick(firstNames, i * 4)
  const guarantor1Last = pick(lastNames, i * 6)
  const guarantor1Name = `${guarantor1First} ${guarantor1Last}`
  const guarantor2First = pick(firstNames, i * 9)
  const guarantor2Last = pick(lastNames, i * 10)
  const guarantor2Name = `${guarantor2First} ${guarantor2Last}`

  const relationship = ['Sister', 'Brother', 'Parent', 'Friend'][i % 4]

  return {
    id: `user-${pad(i + 1)}-${randomUUID().slice(0, 8)}`,
    organization: org,
    username: `${first}${last}`.replace(/\s/g, ''),
    email,
    phoneNumber,
    dateJoined: isoDateFrom(i),
    status,
    profile: {
      fullName,
      avatarUrl: null,
      bvn,
      gender,
      maritalStatus,
      children: i % 3 === 0 ? 'None' : String((i % 4) + 1),
      typeOfResidence,
    },
    tier,
    accountSummary: {
      balance,
      accountNumber,
      bankName,
    },
    educationAndEmployment: {
      levelOfEducation: level,
      employmentStatus,
      sectorOfEmployment: sector,
      durationOfEmployment: duration,
      officeEmail,
      monthlyIncome: [minIncome, maxIncome],
      loanRepayment,
    },
    socials,
    guarantors: [
      {
        fullName: guarantor1Name,
        phoneNumber: `0${digitsFrom(i + 509, 10)}`,
        email: `${guarantor1First.toLowerCase()}@gmail.com`,
        relationship,
      },
      {
        fullName: guarantor2Name,
        phoneNumber: `0${digitsFrom(i + 887, 10)}`,
        email: `${guarantor2First.toLowerCase()}@gmail.com`,
        relationship,
      },
    ],
  }
}

const COUNT = 520
const users = Array.from({ length: COUNT }, (_, i) => makeUser(i))

await writeFile('src/mocks/users.json', JSON.stringify(users, null, 2) + '\n', 'utf8')
console.log(`Wrote src/mocks/users.json with ${users.length} users`)


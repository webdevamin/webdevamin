'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  ShoppingBag,
  Star,
} from 'lucide-react'
import BlockLayoutOne from '../Layouts/BlockLayoutOne'
import Heading from '../Heading'
import { FullBleedLine } from '../Layouts/BorderedSection'

const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const moneyFormat = new Intl.NumberFormat('nl-BE', {
  style: 'currency',
  currency: 'EUR',
})
const money = (cents) => moneyFormat.format(cents / 100)
const formatDate = (date) => dateFormat.format(new Date(`${date}T12:00:00Z`))

function Choices({ label, options, value, onChange }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="mt-3.5 flex flex-wrap gap-1.5"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={`min-h-11 rounded-md border-0 px-3 py-2 text-xs font-semibold sm:text-sm transition-colors ${value === option.id ? 'bg-[#fff0f1] text-theme_darker' : 'bg-transparent text-[#777] hover:text-theme_darker'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function Feedback({ children }) {
  return (
    <div role="status" className="text-sm font-medium text-emerald-800">
      {children && (
        <span className="flex items-start gap-2">
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          {children}
        </span>
      )}
    </div>
  )
}

function CompactPreview({ feature, content }) {
  const { demo, compact: c } = content
  const l = demo.labels
  const [selected, setSelected] = useState(0)
  const [sent, setSent] = useState(false)
  let body
  let notification

  if (feature.id === 'reservaties') {
    body = (
      <div className="grid gap-[9px] lg:flex-1 lg:auto-rows-fr">
        {demo.reservation.rows.map((row) => (
          <div
            className="flex min-w-0 items-center gap-2 rounded-[10px] border border-[#e8e8e8] p-3 sm:gap-3 sm:p-3.5 lg:p-[18px] [&>div]:min-w-0 [&>div]:flex-1 [&_strong]:block [&_strong]:text-sm [&_strong]:font-semibold [&_small]:mt-[3px] [&_small]:block [&_small]:text-xs [&_small]:leading-[1.6] [&_small]:text-[#818181] [&_em]:ml-auto [&_em]:shrink-0 [&_em]:text-sm [&_em]:font-semibold [&_em]:not-italic [&_em]:text-theme_darker"
            key={row.id}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-theme"
              aria-hidden="true"
            />
            <div>
              <strong>{row.name}</strong>
              <small>
                {row.party} {l.guestCount} · {l.table} {row.table}
              </small>
            </div>
            <em>{row.time}</em>
          </div>
        ))}
      </div>
    )
    notification = (
      <>
        <CalendarDays size={18} />
        <div>
          <strong>{c.newReservation}</strong>
          <small>{c.notification}</small>
        </div>
      </>
    )
  } else if (feature.id === 'meldingen') {
    const message = demo.messages[selected]
    body = (
      <>
        <Choices
          label={l.messageFlow}
          options={demo.messages}
          value={message.id}
          onChange={(id) =>
            setSelected(demo.messages.findIndex((item) => item.id === id))
          }
        />
        <div className="mt-5 rounded-[10px] border border-[#e8e8e8] p-4 lg:flex lg:flex-1 lg:flex-col lg:justify-center [&>svg]:mb-3 [&>svg]:text-theme_darker [&>strong]:block [&>strong]:text-base [&>p]:mb-0">
          <Mail size={20} />
          <strong>{message.subject}</strong>
          <p>{message.body}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#818181] sm:text-sm">
          <Clock3 size={14} />
          {message.timing}
        </div>
      </>
    )
  } else if (feature.id === 'menukaart') {
    body = (
      <div className="grid gap-[9px] lg:flex-1 lg:auto-rows-fr">
        {demo.dishes.slice(0, 4).map((dish) => (
          <div
            className="flex min-w-0 items-center gap-2 rounded-[10px] border border-[#e8e8e8] p-3 sm:gap-3 sm:p-3.5 lg:p-[18px] [&>div]:min-w-0 [&>div]:flex-1 [&_strong]:block [&_strong]:text-sm [&_strong]:font-semibold [&_small]:mt-[3px] [&_small]:block [&_small]:text-xs [&_small]:leading-[1.6] [&_small]:text-[#818181] [&_em]:ml-auto [&_em]:shrink-0 [&_em]:text-sm [&_em]:font-semibold [&_em]:not-italic [&_em]:text-theme_darker"
            key={dish.id}
          >
            <div>
              <strong>{dish.name}</strong>
              <small>{dish.vegetarian ? l.vegetarian : dish.allergens}</small>
            </div>
            <em>{money(dish.price)}</em>
          </div>
        ))}
      </div>
    )
  } else if (feature.id === 'klanten') {
    const customer = demo.customers[selected]
    body = (
      <>
        <div className="mb-5 flex items-center gap-3 [&>span]:grid [&>span]:h-10 [&>span]:w-10 [&>span]:place-items-center [&>span]:rounded-full [&>span]:bg-[#fff0f1] [&>span]:text-xs [&>span]:text-theme_darker [&_strong]:block [&_strong]:text-sm [&_strong]:font-semibold [&_small]:mt-[3px] [&_small]:block [&_small]:text-xs [&_small]:leading-[1.6] [&_small]:text-[#818181]">
          <span>
            {customer.name
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </span>
          <div>
            <strong>{customer.name}</strong>
            <small>
              {customer.visits} {l.visits}
            </small>
          </div>
        </div>
        <div className="mb-[18px] [&_small]:mb-[5px] [&_small]:block [&_small]:text-xs [&_small]:text-[#818181] [&_strong]:text-sm [&_strong]:font-medium">
          <small>{l.preferences}</small>
          <strong>{customer.preference}</strong>
        </div>
        <div className="mb-[18px] [&_small]:mb-[5px] [&_small]:block [&_small]:text-xs [&_small]:text-[#818181] [&_strong]:text-sm [&_strong]:font-medium">
          <small>{l.notes}</small>
          <strong>{customer.notes}</strong>
        </div>
        <div className="grid gap-[9px]">
          {customer.history.map((visit) => (
            <div
              className="flex min-w-0 items-center gap-2 rounded-[10px] border border-[#e8e8e8] p-3 sm:gap-3 sm:p-3.5 lg:p-[18px] [&>div]:min-w-0 [&>div]:flex-1 [&_strong]:block [&_strong]:text-sm [&_strong]:font-semibold [&_small]:mt-[3px] [&_small]:block [&_small]:text-xs [&_small]:leading-[1.6] [&_small]:text-[#818181] [&_em]:ml-auto [&_em]:shrink-0 [&_em]:text-sm [&_em]:font-semibold [&_em]:not-italic [&_em]:text-theme_darker"
              key={visit.date}
            >
              <span>{formatDate(visit.date)}</span>
              <small>
                {visit.party} {l.guestCount}
              </small>
            </div>
          ))}
        </div>
        <Choices
          label={l.profile}
          options={demo.customers.map((item, i) => ({
            id: i,
            label: item.name.split(' ')[0],
          }))}
          value={selected}
          onChange={setSelected}
        />
      </>
    )
  } else if (feature.id === 'reviews') {
    body = (
      <div className="py-1.5 text-center lg:flex lg:flex-1 lg:flex-col [&>div[role=status]]:mt-3 [&>div[role=status]]:text-left [&>div[role=status]]:text-xs">
        <div className="rounded-[10px] border border-[#e8e8e8] p-4 lg:flex lg:flex-1 lg:flex-col lg:justify-center [&_p]:mb-0">
          <div
            className="mb-5 flex justify-center gap-[5px] text-theme"
            aria-hidden="true"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={20} />
            ))}
          </div>
          <strong className="text-lg">{l.reviewTitle}</strong>
          <p>{l.reviewBody}</p>
        </div>
        <button
          type="button"
          className="mt-5 inline-flex min-h-11 items-center gap-2.5 rounded-[7px] bg-theme_darker px-3.5 py-2.5 text-xs text-white sm:text-sm lg:self-center disabled:bg-[#f1f1f1] disabled:text-[#555]"
          disabled={sent}
          onClick={() => setSent(true)}
        >
          {sent ? l.reviewSent : l.reviewSend}
          <ArrowRight size={14} aria-hidden="true" />
        </button>
        <Feedback>{sent && l.reviewFeedback}</Feedback>
      </div>
    )
  } else if (feature.id === 'bestellingen') {
    const dishes = demo.dishes.slice(1, 5)
    body = (
      <>
        <div className="mb-4 flex justify-between gap-2.5 text-sm text-[#777]">
          <span>#001</span>
          <span>{c.orderMeta}</span>
        </div>
        <div className="grid gap-[9px] lg:flex-1 lg:auto-rows-fr">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="flex min-w-0 items-center gap-2 rounded-[10px] border border-[#e8e8e8] p-3 sm:gap-3 sm:p-3.5 lg:p-[18px] [&>div]:min-w-0 [&>div]:flex-1 [&_strong]:block [&_strong]:text-sm [&_strong]:font-semibold [&_small]:mt-[3px] [&_small]:block [&_small]:text-xs [&_small]:leading-[1.6] [&_small]:text-[#818181] [&_em]:ml-auto [&_em]:shrink-0 [&_em]:text-sm [&_em]:font-semibold [&_em]:not-italic [&_em]:text-theme_darker"
            >
              <div>
                <strong>1 × {dish.name}</strong>
              </div>
              <em>{money(dish.price)}</em>
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-2.5 pt-[18px] text-sm">
          <span>{l.total}</span>
          <strong>
            {money(dishes.reduce((sum, dish) => sum + dish.price, 0))}
          </strong>
        </div>
      </>
    )
    notification = (
      <>
        <ShoppingBag size={18} />
        <div>
          <strong>{c.orderStatus}</strong>
          <small>{c.orderMeta}</small>
        </div>
      </>
    )
  } else {
    const period = demo.periods[selected]
    body = (
      <>
        <Choices
          label={l.period}
          options={demo.periods}
          value={period.id}
          onChange={(id) =>
            setSelected(demo.periods.findIndex((item) => item.id === id))
          }
        />
        <dl className="my-[22px] flex flex-wrap gap-5 [&_dt]:text-xs [&_dt]:text-[#818181] [&_dd]:mt-1.5 [&_dd]:text-2xl [&_dd]:font-semibold [&_dd]:tracking-[-0.03em]">
          <div>
            <dt>{l.reservations}</dt>
            <dd>{period.reservations}</dd>
          </div>
          <div>
            <dt>{l.guests}</dt>
            <dd>{period.guests}</dd>
          </div>
          <div>
            <dt>{l.revenue}</dt>
            <dd>{money(period.revenue)}</dd>
          </div>
        </dl>
        <div className="mb-[22px] [&>small]:mb-2 [&>small]:block [&>small]:text-xs [&>small]:text-[#818181]">
          <small>{l.popular}</small>
          <div className="grid gap-2 [&>div]:flex [&>div]:justify-between [&>div]:gap-2 [&>div]:text-sm [&_strong]:font-semibold [&_strong]:text-theme_darker">
            {period.popular.map((item) => (
              <div key={item.name}>
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 [&>div>div]:mb-2 [&>div>div]:flex [&>div>div]:justify-between [&>div>div]:gap-2 [&>div>div]:text-xs [&>div>div]:text-[#777] [&_strong]:font-medium">
          {period.busy.map((item) => (
            <div key={item.name}>
              <div>
                <span>{item.name}</span>
                <strong>
                  {item.value} {l.guestCount}
                </strong>
              </div>
              <span className="block h-[5px] overflow-hidden rounded-[5px] bg-[#f3f3f3] [&>span]:block [&>span]:h-full [&>span]:rounded-[inherit] [&>span]:bg-theme">
                <span
                  style={{ width: `${(item.value / period.guests) * 100}%` }}
                />
              </span>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div
      className={`relative mx-0 max-w-[520px] rounded-[14px] border border-[#e5e5e5] bg-white p-4 text-sm shadow-[0_16px_28px_-20px_#00000030,0_3px_6px_#00000005] sm:p-6 lg:mx-auto lg:flex lg:flex-col lg:min-h-[min(520px,calc(100dvh-300px))] [&_p]:mt-2.5 [&_p]:mb-[18px] [&_p]:text-sm [&_p]:leading-[1.8] sm:[&_p]:text-[15px] [&_p]:text-[#757575] [&_p]:opacity-100 ${notification ? 'mt-9 !pt-[42px]' : ''}`}
    >
      {notification && (
        <div
          className="absolute right-3 -top-[34px] flex items-center gap-2.5 rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 shadow-[0_12px_24px_-14px_#00000030] [&_svg]:box-content [&_svg]:rounded-full [&_svg]:bg-[#fff0f1] [&_svg]:p-[9px] [&_svg]:text-theme_darker [&_strong]:block [&_strong]:text-sm [&_strong]:font-semibold [&_small]:mt-[3px] [&_small]:block [&_small]:text-xs [&_small]:leading-[1.6] [&_small]:text-[#818181]"
          aria-hidden="true"
        >
          {notification}
        </div>
      )}
      <div className="mb-5 flex items-center justify-between gap-3 text-[15px] font-bold sm:text-lg [&>span]:text-xs [&>span]:font-normal [&>span]:text-[#888]">
        {feature.title}
        <span>{c.sample}</span>
      </div>
      <div className="lg:flex lg:flex-1 lg:flex-col lg:justify-between">
        {body}
      </div>
    </div>
  )
}

export default function RestaurantFeatures({ content }) {
  const [active, setActive] = useState(0)
  const copies = useRef([])
  const demos = useRef([])
  const activeRef = useRef(0)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    let frame = 0
    function update() {
      frame = 0
      if (!media.matches) return
      const target = window.innerHeight * 0.45
      let next = 0
      let distance = Infinity
      copies.current.forEach((copy, index) => {
        if (!copy) return
        const rect = copy.getBoundingClientRect()
        const currentDistance = Math.abs(rect.top + rect.height / 2 - target)
        if (currentDistance < distance) {
          distance = currentDistance
          next = index
        }
      })
      if (next !== activeRef.current) {
        // Keep keyboard focus out of a preview that is about to be hidden.
        if (
          demos.current[activeRef.current]?.contains(document.activeElement)
        ) {
          copies.current[next]
            ?.querySelector('h3')
            ?.focus({ preventScroll: true })
        }
        activeRef.current = next
        setActive(next)
      }
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    media.addEventListener('change', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      media.removeEventListener('change', schedule)
    }
  }, [])

  return (
    <BlockLayoutOne
      slug="restaurant-features"
      includeMaxWidth={false}
      textCenter={false}
    >
      <section
        className="w-full min-w-0 text-left [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-theme_darker [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-theme_darker [&_button:focus-visible]:outline-offset-4 [&_[tabindex]:focus-visible]:outline [&_[tabindex]:focus-visible]:outline-2 [&_[tabindex]:focus-visible]:outline-theme_darker [&_[tabindex]:focus-visible]:outline-offset-4"
        aria-labelledby="restaurant-features-title"
      >
        <div className="max-w-[850px] [&>p]:max-w-[660px]">
          <div id="restaurant-features-title">
            <Heading title={content.title} subtitle={content.subtitle} />
          </div>
          <p>{content.text}</p>
        </div>
        <nav
          aria-label={content.navigationLabel}
          className="relative mt-8 flex flex-wrap gap-x-6 gap-y-1 py-5 [&_a]:flex [&_a]:min-h-11 [&_a]:items-center [&_a]:gap-2 [&_a]:text-sm [&_a]:font-semibold [&_a]:text-[#595550] [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-theme_darker [&_a[aria-current]]:text-theme_darker [&_a_span]:text-xs [&_a_span]:text-[#898078] motion-reduce:[&_a]:transition-none"
        >
          {/* De onderlijn van dit menu is de bovenlijn van de kolommen hieronder. */}
          <FullBleedLine className="absolute top-0" />
          {content.features.map((feature, index) => (
            <a
              key={feature.id}
              href={`#restaurant-${feature.id}`}
              aria-current={active === index ? 'step' : undefined}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {feature.title}
            </a>
          ))}
        </nav>
        {/* Zelfde regels als LineGrid: op desktop van zijlijn tot zijlijn, met evenveel ruimte aan beide kanten van de scheidingslijn. */}
        <div className="relative py-10 lg:grid lg:grid-cols-2 lg:items-start lg:py-0 xl:-mx-[calc(100%/22)]">
          <FullBleedLine className="absolute top-0" />
          {content.features.map((feature, index) => {
            return (
              <section
                key={feature.id}
                className="block mb-0 lg:contents"
                aria-labelledby={`restaurant-${feature.id}-title`}
              >
                {/* Op gsm en tablet een lijn tussen de functies; op desktop staan ze naast de voorbeeldkolom. */}
                {index > 0 && <FullBleedLine className="relative my-10 lg:hidden" />}
                <div
                  id={`restaurant-${feature.id}`}
                  ref={(element) => {
                    copies.current[index] = element
                  }}
                  className="scroll-mt-[110px] pb-6 lg:col-start-1 lg:flex lg:min-h-[90vh] lg:scroll-mt-0 lg:items-center lg:py-[70px] lg:pr-8 xl:px-12"
                  data-active={active === index}
                  style={{ gridRow: index + 1 }}
                >
                  <div
                    className={`motion-reduce:!transform-none motion-reduce:transition-none lg:transition-[opacity,transform] lg:duration-[500ms,600ms] ${active === index ? 'lg:translate-y-0 lg:opacity-100' : 'lg:translate-y-4 lg:opacity-[0.35]'}`}
                  >
                    <span className="mb-5 inline-block rounded-full bg-[#fff0f1] px-3.5 py-[7px] text-xs font-bold text-theme_darker sm:text-sm">
                      {feature.badge}
                    </span>
                    <h3
                      className="font_mohave mb-5 text-[clamp(28px,2.8vw,42px)] font-semibold normal-case leading-[1.05] tracking-tight [filter:none]"
                      tabIndex={-1}
                      id={`restaurant-${feature.id}-title`}
                    >
                      {feature.title}
                    </h3>
                    <p className="mb-6 text-base leading-[1.8] text-[#625c56] opacity-100 lg:text-lg">
                      {feature.description}
                    </p>
                    <ul className="mt-7 mb-5 list-none p-0 [&_li]:relative [&_li]:border-t [&_li]:border-[#e4e4e4] [&_li]:py-3.5 [&_li]:pl-5 [&_li]:text-base [&_li]:leading-[1.7] [&_li]:before:absolute [&_li]:before:top-[24px] [&_li]:before:left-0 [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:bg-theme lg:[&_li]:text-lg lg:[&_li]:before:top-[26px]">
                      {feature.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  ref={(element) => {
                    demos.current[index] = element
                  }}
                  className={`min-w-0 lg:sticky lg:top-[150px] lg:col-start-2 lg:mt-[120px] lg:max-h-[calc(100dvh-180px)] lg:self-start lg:overflow-y-auto lg:pl-8 lg:pr-4 xl:px-12 lg:pb-4 lg:pt-10 lg:[scrollbar-width:thin] motion-reduce:!animate-none ${active === index ? 'lg:block lg:animate-restaurant-reveal' : 'lg:hidden'}`}
                  data-active={active === index}
                  style={{ gridRow: `1 / span ${content.features.length}` }}
                >
                  <div className="ph-no-capture ph-mask">
                    <CompactPreview feature={feature} content={content} />
                  </div>
                </div>
              </section>
            )
          })}
        </div>
        <p className="mt-8 lg:mt-10 max-w-[800px] p-0 text-sm leading-[1.8] lg:text-base">
          {content.optionNote}
        </p>
      </section>
    </BlockLayoutOne>
  )
}

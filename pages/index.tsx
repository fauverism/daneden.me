/* eslint-disable prefer-const */
import Breakout from "@/components/Breakout"
import Layout from "@/components/Layout"
import Timeline from "@/components/Timeline"
import { colord, extend, LchColor } from "colord"
import lchPlugin from "colord/plugins/lch"
import Link from "next/link"

extend([lchPlugin])

export default function HomePage({
  commitSha,
  bg,
  fg,
}: {
  commitSha: string
  bg: LchColor
  fg: LchColor
}) {
  return (
    <Layout>
      <Breakout>
        <p className="intro">
          Daniel Eden is a Product Designer at{" "}
          <Link href="https://meta.com/">Meta</Link> in London, working on
          making Customer Support experiences that are more equitable, human,
          and helpful. He spends his time <Link href="/blog">writing</Link>,
          thinking, <Link href="https://twitter.com/_dte">tweeting</Link>, and
          talking about Design Systems: how they scale, how they break, and the
          people&nbsp;that maintain&nbsp;them.
        </p>
        <Timeline />
      </Breakout>
      <p className="small">
        This page’s colour scheme is based on the website’s most recent commit,{" "}
        <code>
          <Link
            href={`https://github.com/daneden/daneden.me/commit/${commitSha}`}
          >
            {commitSha.slice(0, 7)}
          </Link>
        </code>
        .
      </p>
      <style jsx>{`
        .intro {
          font-size: clamp(1.5rem, 8vmin, 3.5rem);
          line-height: 1.2;
          font-style: normal;
          font-family: var(--font-sans);
          letter-spacing: -0.025em;
        }

        .intro :global(a) {
          --padding-size: 0.05em;
          font-family: var(--font-heading);
          letter-spacing: 0;
          font-style: italic;
        }
      `}</style>
      <style jsx global>{`
        @supports (color: lch(50% 70 180)) {
          html:has(.intro) {
            --wash-color: lch(${bg.l}% ${bg.c} ${bg.h}) !important;
            --text-color: lch(${fg.l}% ${fg.c} ${fg.h}) !important;
            --meta-color: lch(${fg.l}% ${fg.c} ${fg.h} / 0.75) !important;
            --site-color: lch(
              ${(bg.l + 50) % 100}% ${(bg.c + 30) % 100} ${bg.h}
            ) !important;
            --code-wash: lch(${(bg.l + 10) % 100}% ${bg.c} ${bg.h}) !important;
            --code-color: var(--text-color) !important;
          }
        }
      `}</style>
    </Layout>
  )
}

export async function getStaticProps() {
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || "7ba51d"
  const indices = commitSha
    .slice(0, 6)
    .split("")
    .map((i) => parseInt(i, 16))
  const hex = indices.map((i) => commitSha[i % (commitSha.length - 1)]).join("")
  const bg = colord(`#${hex}`).toLch()

  const fg = {
    ...bg,
    l: (bg.l + 50) % 100,
    h: (bg.h - 180) % 360,
  }

  return {
    props: {
      commitSha,
      bg,
      fg,
    },
  }
}

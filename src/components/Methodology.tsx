export function Methodology() {
  return (
    <section className="methodology" id="methodology">
      <div>
        <h2>A little context behind the counts.</h2>
        <p>Job searching is messy. The analytics shouldn’t be.</p>
      </div>
      <div className="methodology-details">
        <details>
          <summary>What counts as an application?</summary>
          <p>
            A valid, nonfuture Date Applied is submission evidence. Preparing or
            Discovered records with an applied date, post-submission statuses
            without one, and applied dates before a valid found date are
            conflicts. These records stay in opportunity and snapshot counts but
            are excluded from submission metrics until resolved. Unknown status
            with a valid date may count as submitted, but not active.
          </p>
        </details>
        <details>
          <summary>What can’t this dashboard tell us?</summary>
          <p>
            Status is the latest known state. It cannot reveal historical
            transitions, response rates, or stage conversion rates. Pending
            applications are never counted as rejections. Duplicate-looking rows
            are flagged, not removed.
          </p>
        </details>
        <details>
          <summary>How do dates, filters and follow-ups work?</summary>
          <p>
            Date boundaries are inclusive calendar dates in the displayed
            reporting timezone. Weeks start Monday. Missing selected-basis dates
            are excluded only when date bounds are set. Activity uses Date
            Applied within the selected cohort; a Date Found filter can
            therefore include later submissions. Partial periods include today.
            The seven-day mean needs seven observed days and retains earlier
            applied-date history. Follow-ups count only valid dates for active,
            eligible applications; upcoming means any date after the reporting
            day. Stored spreadsheet flags are ignored.
          </p>
        </details>
        <details>
          <summary>What is public, and what stays private?</summary>
          <p>
            Live mode exposes aggregate counts and reviewed category labels
            only. Notes, company-level details, URLs, contact information and
            credentials stay off the public API. Unknown labels are grouped as
            Unknown. Small filtered cohorts may still be identifiable; this is
            not a statistical anonymity guarantee. The explorer is always
            fictional.
          </p>
        </details>
      </div>
    </section>
  );
}

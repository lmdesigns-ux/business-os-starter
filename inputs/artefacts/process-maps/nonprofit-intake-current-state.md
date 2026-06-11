# Nonprofit client intake — current state

```json
{
  "id": "nonprofit-intake-current-state",
  "title": "Nonprofit client intake — current state",
  "type": "process_map",
  "status": "draft",
  "scope": "Fictional community health nonprofit — new client intake from first contact to enrolled in program",
  "tags": ["nonprofit", "intake", "current-state"],
  "externalUrl": null,
  "updated": "2026-06-10"
}
```

## Context

Fictional example for workshopping process map format. Represents a common nonprofit pattern: referrals arrive through multiple channels, eligibility is checked manually, and enrollment data lives in a spreadsheet until someone enters it into the case management system.

Use this map to test Mermaid rendering in the portal. For a client deliverable, a FigJam or Miro board would typically replace or supplement the diagram below.

## Map

```mermaid
flowchart TD
  subgraph channels [Referral channels]
    Phone[Phone call]
    Partner[Partner referral]
    WalkIn[Walk-in]
    Web[Web form]
  end

  Phone --> LogCall[Front desk logs call in spreadsheet]
  Partner --> EmailRef[Email to intake inbox]
  WalkIn --> PaperForm[Paper intake form]
  Web --> FormSubmit[Form submission notification]

  EmailRef --> Triage[Intake coordinator triages daily]
  FormSubmit --> Triage
  LogCall --> Triage
  PaperForm --> DataEntry[Volunteer data entry]

  Triage --> Eligibility{Meets eligibility?}
  DataEntry --> Eligibility

  Eligibility -->|No| Decline[Send decline letter + referrals]
  Eligibility -->|Yes| Schedule[Schedule intake appointment]

  Schedule --> IntakeAppt[Intake appointment]
  IntakeAppt --> CMSEnroll[Enter in case management system]
  CMSEnroll --> Enrolled([Enrolled in program])

  Eligibility -->|Unclear| WaitList[Hold on wait list — manual review]
  WaitList --> IntakeAppt
```

## Pain points

- Four intake channels with no single queue — things get lost in email
- Eligibility criteria interpreted differently by staff
- 2–5 day lag between paper form and spreadsheet entry
- Case management system is "system of record" but data arrives late
- No visibility for program managers on pipeline volume

## Open questions

- Should eligibility pre-screening move to the web form?
- Who owns the wait list — intake coordinator or program director?
- Is the spreadsheet temporary or has it become permanent infrastructure?

## Review notes

- [2026-06-10] Initial seed — fictional nonprofit scenario for portal demo

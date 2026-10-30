# RuralClass — Product Brief

> The original product brief used to scope the hackathon prototype. It describes the intended product, workflows and design constraints.

You are an expert full-stack developer, UI/UX designer, product architect, and hackathon prototyping specialist.

Build a complete, functional prototype called **RuralClass**.

## 1. PRODUCT OVERVIEW

RuralClass is a teacher-centred planning and student-support platform designed for rural and underserved primary schools in Karnataka, India.

The core problem is that one teacher may have to manage multiple grades in the same classroom. The teacher needs to:

- Plan lessons for different grades.
- Divide limited classroom time.
- Decide which grade receives direct teacher instruction.
- Give meaningful independent/group activities to other grades.
- Track student assessment and learning progress.
- Identify students who may need additional support.
- Plan interventions without spending excessive time maintaining separate records.

RuralClass should combine these tasks into one simple workflow.

The prototype must demonstrate that:

**Student Progress → Learning Gap → Intervention Suggestion**

and

**Grades + Teacher Availability + Periods → Conflict-Free Multi-Grade Timetable**

The system should assist the teacher, NOT replace teacher judgement.

---

# 2. PRIMARY PROTOTYPE GOAL

Create a polished hackathon-ready MVP that allows a judge to understand the complete RuralClass workflow within 3–5 minutes.

The prototype must have realistic sample data and should work without requiring external APIs.

Do NOT build only a static landing page.

The dashboard and core modules must be interactive.

The prototype should demonstrate:

1. Teacher login/demo access.
2. School-specific dashboard.
3. Multi-grade timetable planning.
4. Lesson planning.
5. Student progress tracking.
6. Learning-gap identification.
7. Intervention suggestions.
8. Teacher approval/editing of suggestions.
9. Kannada/English interface toggle.
10. Responsive design.

---

# 3. TARGET USERS

Primary user:

**Teacher**

Secondary users:

**School Head / School Administrator**

For the hackathon prototype, focus primarily on the teacher experience.

Do not make the application unnecessarily complicated with large administrative features.

---

# 4. TECHNOLOGY STACK

Use a modern, simple stack suitable for a hackathon prototype.

Preferred stack:

- Frontend: React
- Language: JavaScript or TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- Charts: Recharts
- Backend: Node.js + Express if backend functionality is required
- Database: MongoDB

However, if a full backend/database makes the prototype unnecessarily difficult to run, create a realistic local mock-data layer first.

Architecture should make it easy to replace mock data with MongoDB later.

Do NOT depend on paid APIs.

Do NOT require an AI API for the core prototype.

Use deterministic, explainable rules for timetable generation and intervention suggestions.

---

# 5. DESIGN DIRECTION

Create a modern but highly practical educational dashboard.

The application should feel:

- Simple
- Trustworthy
- Warm
- Accessible
- Rural-school friendly
- Professional
- Lightweight
- Easy for a teacher who is not highly technical

Avoid an overly corporate SaaS appearance.

Avoid excessive animations.

Prioritize clarity and usability.

Use:

- Large readable typography.
- Clear cards.
- Simple navigation.
- Helpful empty states.
- Meaningful icons.
- Accessible contrast.
- Rounded but professional UI elements.
- Minimal visual clutter.

Use a calm educational visual style.

Suggested visual identity:

**RuralClass**

Tagline:

**"Plan smarter. Teach better. Support every learner."**

---

# 6. APPLICATION STRUCTURE

Create the following main navigation:

1. Dashboard
2. Timetable
3. Lesson Planner
4. Students
5. Progress
6. Interventions
7. School
8. Settings

Sidebar navigation should remain visible on desktop.

On mobile, use a collapsible navigation menu.

Top navigation should contain:

- School name
- Current teacher
- Language toggle: English / ಕನ್ನಡ
- Notifications
- Profile menu

---

# 7. DEMO SCHOOL

Create realistic sample data for a Karnataka rural primary school.

School:

**Government Higher Primary School, Hallikeri**

Location:

**Karnataka**

Grades:

- Grade 1
- Grade 2
- Grade 3
- Grade 4
- Grade 5

Teacher:

**Anita Teacher**

Subjects:

- Kannada
- English
- Mathematics
- Environmental Studies

Use realistic but fictional student names.

Do not use real children's personal information.

---

# 8. LOGIN / DEMO ENTRY

Create a simple login screen.

Heading:

**Welcome to RuralClass**

Subheading:

**Smart planning for multi-grade classrooms**

Fields:

- Teacher ID
- Password

Buttons:

**Sign In**

and

**Try Demo**

The "Try Demo" button should immediately enter the application with sample data.

For the hackathon, authentication can be simulated.

---

# 9. DASHBOARD

Create a highly useful teacher dashboard.

Header:

**Good morning, Anita 👋**

Subheading:

**Here is your classroom overview for today.**

Show summary cards:

### Today's Classes
Example:

5 periods

### Grades
Example:

Grades 1–5

### Students
Example:

42 students

### Follow-up Needed
Example:

6 learners

Below the summary cards show:

## Today's Teaching Plan

Create a timeline/table such as:

| Time | Teacher-led | Independent Activity |
|---|---|---|
| 9:00–9:40 | Grade 3 Mathematics | Grade 1 number practice |
| 9:40–10:20 | Grade 1 Kannada | Grade 4 reading activity |
| 10:40–11:20 | Grade 5 EVS | Grade 2 worksheet |
| 11:20–12:00 | Grade 2 Mathematics | Grade 3 group activity |

Clearly show that the teacher is never assigned to two grades simultaneously.

Add status indicators:

- Ready
- In progress
- Completed

---

# 10. DASHBOARD — LEARNER FOLLOW-UP

Create a section:

**Learners Needing Follow-up**

Example:

| Student | Grade | Area | Status |
|---|---|---|---|
| Kavya | Grade 2 | Reading | Needs practice |
| Rahul | Grade 3 | Addition | Needs support |
| Meena | Grade 4 | English vocabulary | Improving |

Each student should have:

**View →**

button.

Clicking it opens the student's progress details.

---

# 11. DASHBOARD — QUICK ACTIONS

Create prominent buttons:

**Create Lesson Plan**

**Plan Timetable**

**Record Assessment**

**View Interventions**

These should navigate to the corresponding modules.

---

# 12. SMART TIMETABLE PLANNER

This is one of the most important hackathon features.

Create a timetable page.

Title:

**Smart Timetable Planner**

Subheading:

**Create a practical schedule for your multi-grade classroom.**

Allow the teacher to select:

- Number of grades
- Grades
- Subjects
- Number of periods
- Period duration
- Teacher availability

Example:

Grades:

☑ Grade 1
☑ Grade 2
☑ Grade 3
☑ Grade 4
☑ Grade 5

Period duration:

40 minutes

Number of periods:

6

Create button:

**Generate Timetable**

---

# 13. TIMETABLE GENERATION LOGIC

Implement a simple rule-based scheduling engine.

The engine should:

1. Read selected grades.
2. Read available periods.
3. Read teacher availability.
4. Assign one grade to direct teacher instruction per period.
5. Assign meaningful independent/group activities to other grades.
6. Prevent teacher conflicts.
7. Avoid repeatedly teaching the same grade in consecutive periods where possible.
8. Balance subjects across the day.
9. Produce a readable timetable.

Example output:

| Time | Teacher-led | Grade 1 | Grade 2 | Grade 3 | Grade 4 | Grade 5 |
|---|---|---|---|---|---|---|
| 9:00 | Grade 3 Math | Number Activity | Reading | **Teacher** | Worksheet | Group Task |
| 9:40 | Grade 1 Kannada | **Teacher** | Math Practice | Reading | Group Task | EVS |
| 10:20 | Grade 5 EVS | Drawing | Worksheet | Group Reading | Math | **Teacher** |

The interface should visually distinguish:

**Teacher-led**

from

**Independent / Group Activity**

Use labels such as:

"Teacher-led"

"Independent"

"Group"

---

# 14. TIMETABLE EXPLANATION

After generating a timetable, show:

**Why this schedule?**

Example:

"Grade 3 receives direct instruction during the first period because Mathematics was prioritised. Grades 1, 2, 4 and 5 receive age-appropriate independent activities during this time."

This demonstrates explainability.

Add buttons:

**Accept Timetable**

**Edit**

**Regenerate**

---

# 15. LESSON PLANNER

Create a lesson planner page.

Heading:

**Create Lesson Plan**

Fields:

Grade:

Dropdown

Subject:

Dropdown

Topic:

Text input/dropdown

Learning objective:

Text input

Available time:

20 / 30 / 40 / 60 minutes

Learning level:

- Beginner
- Developing
- Grade-level
- Advanced

Materials available:

- Blackboard
- Textbook
- Paper
- Flashcards
- Local objects
- No special materials

Button:

**Generate Lesson Plan**

---

# 16. LESSON PLAN OUTPUT

Generate a structured lesson plan.

Example:

## Grade 3 Mathematics

### Topic
Addition with Carrying

### Learning Objective
Students will solve two-digit addition problems with carrying.

### Duration
40 minutes

### 1. Introduction — 5 min

Teacher demonstrates addition using simple objects.

### 2. Teacher-led instruction — 10 min

Explain the concept using the blackboard.

### 3. Guided practice — 10 min

Students solve three examples with the teacher.

### 4. Independent activity — 10 min

Students complete a short worksheet.

### 5. Quick assessment — 5 min

Three questions to check understanding.

### Materials

- Blackboard
- Chalk
- Notebook

Include:

**Save Lesson Plan**

**Edit**

**Mark as Completed**

---

# 17. MULTI-GRADE LESSON MODE

This is an important differentiating feature.

Add a toggle:

**Multi-Grade Mode**

When enabled, show:

### Teacher-led group

Grade 3 — Mathematics

### Independent groups

Grade 1 — Number recognition activity

Grade 2 — Addition worksheet

Grade 4 — Reading comprehension

Grade 5 — EVS group discussion

This demonstrates how RuralClass handles multiple grades simultaneously.

---

# 18. STUDENT MODULE

Create a student management page.

Heading:

**Students**

Provide:

- Search
- Grade filter
- Subject filter
- Learning status filter

Table:

| Student | Grade | Reading | Mathematics | Attendance | Status |
|---|---|---|---|---|---|
| Kavya | 2 | Developing | Good | 94% | Needs support |
| Rahul | 3 | Good | Developing | 91% | Follow-up |
| Meena | 4 | Good | Good | 97% | On track |

Do not use complex grading terminology.

Use understandable labels:

- On track
- Improving
- Needs support
- Follow-up

---

# 19. STUDENT PROFILE

Clicking a student opens a detailed profile.

Show:

Student name

Grade

Attendance

Subject progress

Recent assessments

Teacher observations

Follow-up history

Example:

### Mathematics

Current level:

**Developing**

Recent scores:

- Addition: 55%
- Subtraction: 62%
- Multiplication: 48%

Trend chart:

Show a simple line chart using Recharts.

Below the chart:

**Teacher Observation**

"Student understands basic addition but needs additional practice with multiplication."

---

# 20. PROGRESS MODULE

Create a progress dashboard.

Show:

- Overall students
- Students on track
- Students improving
- Students needing support

Create simple charts:

### Subject Performance

Mathematics

Reading

English

EVS

Use bar charts.

Create:

### Learning Gap Overview

Example:

Reading:

8 students need support

Mathematics:

6 students need support

English:

4 students need support

EVS:

2 students need support

Make the information visually easy to understand.

---

# 21. ASSESSMENT ENTRY

Create an interface for teachers to record assessments.

Fields:

Student

Subject

Topic

Score

Maximum score

Observation

Button:

**Save Assessment**

After saving, update the student's progress.

Use mock/local state if no backend is implemented.

---

# 22. INTERVENTION ENGINE

This is another core feature.

Create a page:

**Intervention Suggestions**

Subheading:

**Review learning needs and choose the next teaching action.**

Example student:

**Rahul — Grade 3**

Learning area:

Multiplication

Recent performance:

48%

Status:

Needs support

Then display:

### Suggested Actions

1. **10-minute multiplication practice**
   - Use repeated addition examples.

2. **Peer learning activity**
   - Pair Rahul with a student who has demonstrated confidence in multiplication.

3. **Low-resource worksheet**
   - Provide five multiplication questions using familiar objects.

4. **Teacher re-teaching**
   - Review multiplication tables from 2–5.

Each recommendation must have:

**Why suggested**

Example:

"Suggested because the student's last two multiplication assessments were below the selected support threshold."

Buttons:

**Accept**

**Edit**

**Dismiss**

---

# 23. EXPLAINABLE RULES

Do not create mysterious AI decisions.

Use transparent rules such as:

IF average score < 50%
→ "Needs support"

IF average score between 50% and 70%
→ "Developing"

IF average score > 70%
→ "On track"

IF student has two consecutive low scores
→ Recommend additional practice.

IF reading score is low
→ Recommend reading practice.

IF mathematics score is low
→ Recommend guided problem-solving practice.

Display the rule behind every suggestion.

Example:

**Reason: 2 recent assessments below 50%.**

This is important for responsible educational technology.

---

# 24. INTERVENTION TRACKING

After the teacher clicks:

**Accept**

create an intervention record.

Show:

Student:

Rahul

Intervention:

Multiplication practice

Date:

Today

Assigned by:

Anita Teacher

Status:

Active

Buttons:

**Mark Completed**

**Add Observation**

---

# 25. KANNADA / ENGLISH

Implement a functional language toggle:

**English | ಕನ್ನಡ**

At minimum, translate:

- Dashboard
- Timetable
- Lesson Planner
- Students
- Progress
- Interventions
- Settings
- Save
- Edit
- Generate
- Completed
- Needs Support
- Teacher-led
- Independent Activity

Example:

Dashboard:

**ಡ್ಯಾಶ್‌ಬೋರ್ಡ್**

Students:

**ವಿದ್ಯಾರ್ಥಿಗಳು**

Progress:

**ಪ್ರಗತಿ**

Interventions:

**ಹಸ್ತಕ್ಷೇಪಗಳು**

Do not use machine-translated-looking awkward Kannada.

Keep Kannada simple and appropriate for school users.

---

# 26. SCHOOL SETTINGS

Create a School page.

Show:

School name

Location

Grades supported

Subjects

Teacher count

Student count

Language preference

Connectivity mode

Example:

### Connectivity

○ Good
○ Limited
● Very Limited

If "Very Limited" is selected, display:

"RuralClass is designed to keep core planning and record-entry workflows lightweight."

---

# 27. LOW-BANDWIDTH DESIGN

The application should visually communicate that it is designed for low-connectivity environments.

Avoid:

- Video backgrounds
- Heavy animations
- Auto-playing media
- Large images
- Unnecessary external API calls

Use lightweight icons and UI components.

The core dashboard, timetable, lesson plans and student records should remain usable without continuous internet connectivity in the prototype architecture.

If possible, implement local persistence using localStorage.

---

# 28. DATA MODEL

Structure the application around these entities:

### School

- id
- name
- location
- grades
- subjects
- language

### Teacher

- id
- name
- schoolId
- assignedGrades

### Student

- id
- schoolId
- name
- grade
- attendance
- subjects

### Assessment

- id
- studentId
- subject
- topic
- score
- maxScore
- date
- observation

### LessonPlan

- id
- teacherId
- grade
- subject
- topic
- objective
- duration
- activities
- materials

### Timetable

- id
- schoolId
- teacherId
- day
- period
- teacherLedGrade
- independentActivities

### Intervention

- id
- studentId
- reason
- suggestion
- status
- date

Ensure schoolId is used so that data from different schools cannot be mixed.

---

# 29. MULTI-SCHOOL SUPPORT

The architecture must support multiple schools.

Create a school selector for demonstration purposes.

Example:

**Government Higher Primary School, Hallikeri**

**Government Primary School, Belagavi**

When switching schools, the dashboard data should change.

Important:

School A's students must never appear in School B's student list.

This demonstrates multi-school scalability.

---

# 30. RESPONSIVE DESIGN

The application must work on:

- Desktop
- Laptop
- Tablet
- Mobile

For mobile:

- Collapse sidebar.
- Use cards instead of wide tables where necessary.
- Keep primary actions easily accessible.

---

# 31. DEMO DATA

Create enough realistic sample data to make the application feel alive.

Use approximately:

- 5 grades
- 40–50 students
- 5–10 assessments per selected students
- 5–8 intervention records
- 1 full weekly timetable
- 5–10 lesson plans

Do not require the user to manually enter all this data during the demo.

---

# 32. HACKATHON DEMO FLOW

The application must support this exact demonstration:

### Step 1

Login using Demo.

### Step 2

Dashboard shows:

"6 learners need follow-up."

### Step 3

Open Timetable.

Click:

**Generate Timetable**

Show how one teacher manages Grades 1–5 without scheduling conflicts.

### Step 4

Open Lesson Planner.

Select:

Grade 3

Mathematics

Multiplication

Click:

**Generate Lesson Plan**

Show the generated lesson structure.

### Step 5

Open Students.

Select Rahul.

Show his mathematics progress.

### Step 6

The system identifies:

"Needs support"

because of low recent assessment scores.

### Step 7

Open Intervention Suggestions.

Show:

"10-minute multiplication practice"

and explain why it was suggested.

### Step 8

Teacher clicks:

**Accept**

The intervention becomes active.

### Step 9

Switch:

**English → ಕನ್ನಡ**

Demonstrate the localized interface.

This should create a strong end-to-end hackathon story.

---

# 33. RESPONSIBLE AI / ETHICAL DESIGN

Do not claim that RuralClass can diagnose learning disabilities or determine a child's ability.

Use language such as:

"Possible learning gap"

"Needs follow-up"

"Suggested practice"

"Teacher review required"

Never use:

"AI says this student is weak."

The teacher must always have final control.

Include a small notice:

**"RuralClass provides planning and support suggestions. Teachers make the final decisions."**

---

# 34. PRIVACY

Do not expose sensitive student information unnecessarily.

Use fictional demo data.

Only collect fields necessary for the educational workflow.

Do not include:

- Aadhaar numbers
- Phone numbers
- Home addresses
- Medical information
- Sensitive family information

The prototype should demonstrate data minimisation.

---

# 35. EMPTY STATES

Every module should have a useful empty state.

Example:

"No interventions yet."

"Record an assessment to see learning-support suggestions."

Avoid blank screens.

---

# 36. LOADING / SUCCESS STATES

Implement realistic UI feedback.

Examples:

When generating timetable:

"Planning your multi-grade schedule..."

When generating lesson:

"Creating a lesson structure..."

After saving:

"Lesson plan saved successfully."

After accepting intervention:

"Intervention added to Rahul's support plan."

Use small toast notifications.

---

# 37. ERROR HANDLING

Add basic validation.

Examples:

If required lesson fields are missing:

"Please select a grade, subject and topic."

If assessment score exceeds maximum:

"Score cannot be greater than maximum score."

If timetable cannot be generated:

"No conflict-free schedule could be generated with the selected constraints. Try adjusting available periods."

---

# 38. ACCESSIBILITY

Ensure:

- Good contrast.
- Readable font sizes.
- Keyboard navigation where practical.
- Buttons have clear labels.
- Do not rely only on colour to communicate status.
- Use icons + text.
- Forms have labels.

---

# 39. LANDING / ABOUT SECTION

Create a simple About section accessible from the application.

Heading:

**Why RuralClass?**

Text:

"RuralClass helps teachers manage the complexity of multi-grade classrooms by connecting timetable planning, lesson preparation and student progress in one practical workflow."

Show three cards:

### Plan

Build practical multi-grade schedules.

### Teach

Create structured lessons that fit available time and resources.

### Support

Turn learning observations into actionable follow-up activities.

---

# 40. DASHBOARD METRICS

Include useful metrics such as:

**Weekly lessons planned:** 18

**Lessons completed:** 15

**Students assessed:** 32

**Learners needing follow-up:** 6

**Interventions completed:** 4

Do not create unrealistic precision. These are demo values.

---

# 41. IMPORTANT UI DETAIL

Whenever showing a learning-support recommendation, display a small explanation.

Example:

> Suggested because Rahul's last two Mathematics assessments were below 50%.

Then:

**Teacher decision:**

[Accept] [Edit] [Dismiss]

This reinforces the teacher-centred philosophy.

---

# 42. DO NOT OVERBUILD

This is a hackathon prototype.

Prioritize:

1. Working dashboard.
2. Timetable generation.
3. Lesson planning.
4. Student progress.
5. Intervention suggestions.
6. Kannada/English toggle.
7. Responsive UI.

Do NOT spend most of the implementation time on:

- Complex authentication.
- Payment systems.
- Advanced AI.
- Complex admin management.
- Real-time messaging.
- Video content.
- Large-scale analytics.

---

# 43. COMPONENT STRUCTURE

Organize the frontend cleanly.

Suggested structure:

src/

components/

- Sidebar
- Topbar
- StatCard
- StudentCard
- ProgressChart
- TimetableGrid
- LessonPlanCard
- InterventionCard
- StatusBadge
- LanguageToggle
- Modal
- Toast

pages/

- Login
- Dashboard
- Timetable
- LessonPlanner
- Students
- StudentProfile
- Progress
- Interventions
- School
- Settings

data/

- demoStudents
- demoAssessments
- demoLessons
- demoTimetable
- demoInterventions

services/

- timetableEngine
- interventionEngine
- lessonPlanner

utils/

- scoringRules
- translations

---

# 44. CODE QUALITY

Write clean, modular code.

Avoid putting the entire application into one file.

Use reusable components.

Keep business logic separate from UI.

Use meaningful variable names.

Add comments for the timetable algorithm and intervention rules.

Make the project easy for another developer to understand.

---

# 45. FINAL PROTOTYPE REQUIREMENTS

Before considering the prototype complete, verify:

[ ] Application runs without errors.

[ ] Demo login works.

[ ] Dashboard contains realistic data.

[ ] Timetable can be generated.

[ ] Timetable prevents teacher conflicts.

[ ] Independent activities are displayed for other grades.

[ ] Lesson plan can be generated.

[ ] Lesson plan can be saved.

[ ] Students can be searched and filtered.

[ ] Student profile shows assessment history.

[ ] Progress charts work.

[ ] Learning-support status is calculated.

[ ] Intervention suggestions are generated using explainable rules.

[ ] Teacher can accept/edit/dismiss intervention.

[ ] Accepted intervention appears in intervention tracking.

[ ] English/Kannada toggle works.

[ ] School selector works with separate demo data.

[ ] Responsive layout works.

[ ] No paid API is required.

[ ] No real student personal data is used.

[ ] Core functionality works with mock/local data.

---

# 46. FINAL INSTRUCTION TO THE AI CODING AGENT

Do not merely describe how to build RuralClass.

Actually build the working prototype.

Start by creating the application structure and core UI.

Then implement the dashboard.

Then implement the timetable engine.

Then implement the lesson planner.

Then implement student progress.

Then implement intervention logic.

Then implement bilingual support.

Finally test the complete demo flow.

If a backend is not necessary for the prototype, use local mock data and localStorage so the application can run immediately.

Make the final result look like a polished startup/hackathon MVP rather than a basic college project.

The most important product story is:

**One teacher + multiple grades + limited time → RuralClass creates a practical teaching plan → student progress identifies a possible learning gap → teacher receives an explainable intervention suggestion → teacher decides what to do.**

Build the prototype around this story.
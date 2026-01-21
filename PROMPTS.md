# Effective Prompts for Building the Work Order Timeline

This document captures some of the most effective prompts used during the development of the work order timeline component.

## UI/UX Requirements

### Fixed Panel Layout
```
Left panel must stay fixed while timeline scrolls
```
**Why it worked**: Clear, specific requirement with a concrete visual outcome. Describes the desired behavior without prescribing implementation details.

## Problem-Solving Feedback

### Visual Issue Identification
```
the timeline is scrolling over the work center column
```
**Why it worked**: Described the observable problem clearly without assumptions about the cause. This allowed for proper diagnosis of z-index issues.

```
check the zindex on the bars
```
**Why it worked**: Specific technical guidance when the issue was clear. Sometimes directing to a specific area speeds up debugging.

### Iterative Refinement
```
still not on top
```
**Why it worked**: Short, direct feedback that something isn't working. Simple negative feedback is often the fastest way to iterate.


### Edge Cases
```
the topmost rows' tooltips are getting cut off at the top of the grid
```
**Why it worked**: Identified a specific edge case with clear reproduction steps (hover on top rows). This led to solving overflow clipping issues.

```
If I hover on a bar near the right edge of the window, the tooltip renders partially... when I scroll horizontally, the tooltip stays partly offscreen. Do you think that's ok?
```
**Why it worked**: Described the edge case behavior, provided context about when it happens, and asked for judgment rather than demanding a fix. This collaborative approach led to viewport-aware tooltip positioning.

## Behavioral Requirements

### Integration Points
```
tooltip should close when panel is opened
```
**Why it worked**: Specified interaction between two components clearly. Identified a UX improvement for state management.

## Key Patterns

1. **Be Specific About Visual Outcomes**: "Left panel must stay fixed" vs "Fix the layout"
2. **Describe Behavior, Not Implementation**: "tooltips when a user hovers" vs "add mouseenter event"
3. **Iterate with Short Feedback**: "nope", "still not on top" - clear signals without over-explanation
4. **Identify Edge Cases Clearly**: Describe the specific scenario where things break
5. **Ask for Judgment When Unsure**: "Do you think that's ok?" invites collaborative problem-solving

## Anti-Patterns to Avoid

- Vague requirements: "make it better" or "fix the UI"
- Over-specification: Dictating exact CSS properties before trying solutions
- Assuming causes: "The z-index is wrong" when you haven't verified it
- Batch feedback: Wait for one issue to be resolved before reporting the next

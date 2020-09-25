# Contributing

The following is a set of guidelines for contributing. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

**Reporting Bugs**

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check this list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible. Fill out the required template, the information it asks for helps us resolve issues faster.

Note: If you find a Closed issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

Before Submitting A Bug Report
You might be able to find the cause of the problem and fix things yourself. Most importantly, check if you can reproduce the problem in the latest version
Perform a cursory search to see if the problem has already been reported. If it has and the issue is still open, add a comment to the existing issue instead of opening a new one.
How Do I Submit A (Good) Bug Report?
Bugs are tracked as GitHub issues. Create an issue on the repository and provide the following information by filling in the template.

Explain the problem and include additional details to help maintainers reproduce the problem:

Use a clear and descriptive title for the issue to identify the problem.
Describe the exact steps which reproduce the problem in as many details as possible. When listing steps, don't just say what you did, but explain how you did it.
Provide specific examples to demonstrate the steps. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use Markdown code blocks.
Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
Explain which behavior you expected to see instead and why.
Include screenshots and animated GIFs which show you following the described steps and clearly demonstrate the problem.
If the problem is related to performance or memory, include a CPU profile capture with your report.
If the problem wasn't triggered by a specific action, describe what you were doing before the problem happened and share more information using the guidelines below.
Provide more context by answering these questions:

Can you reproduce the problem in safe mode
Did the problem start happening recently (e.g. after updating to a new version) or was this always a problem?
If the problem started happening recently, can you reproduce the problem in an older version? What's the most recent version in which the problem doesn't happen?
Can you reliably reproduce the issue? If not, provide details about how often the problem happens and under which conditions it normally happens.
Include details about your configuration and environment:

Which version are you using?
What's the name and version of the OS you're using?
Are you using multiple monitors? If so, can you reproduce the problem when you use a single monitor?
Which keyboard layout are you using? Are you using a US layout or some other layout?
To see the bug report template, please refer to bug_template.md.

## Styleguides  

**Git Commit Messages**  
Use the present tense ("Add feature" not "Added feature")  
Use the imperative mood ("Move cursor to..." not "Moves cursor to...")  

Since GitHub Actions will be used on the CICD pipeline, the [GitHub Tag Action](https://github.com/marketplace/actions/github-tag) will be used to autoincrement our application's version.
To have a good versioning system, use the following commit message format **only once in your "feature" branch** to make the version increment using semantic versioning.
Each message consists of a header, a body and a footer. The header has a **type**, a **scope** and a **subject** like so:
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**Type Examples**: 
| Commit Message | Release Type |
| --------------- | --------------- |
| fix(pipeline): stop breaking on the sonarcloud job | Patch Release| 
| feat(bid): add 'bid' option | Minor Release |
| perf(graphCurrency): remove the graph currency  | Major Release |

Many more types can be used. Refer to this document [here](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#type).

More information on the whole versioning process [here](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

In other cases, we will follow the "50/72" rule which is:  
1) The first line of your commit message must be maximum 50 characters long. No more, and (ideally), no less.  
2) Leave a blank line.  
3) Start writing your description to elaborate on the issues/improvements while trying to wrap each line in your description at (or before) the 72nd mark.  

**Coding style guide:**  
The following has been extracted from the Angular coding style document available at: https://angular.io/guide/styleguide  
Please refer to that document in case you are uncertain about a specific matter that was not pointed out in the following guide

**Coding style Rule 1: Single Responsibility**  
Define one thing, such as a service or component, per file.  
Consider limiting files to 400 lines of code.  

**Coding style Rule 2: Small Functions**  
Define small functions.  
Consider limiting to no more than 75 lines.  

**Coding style Rule 3: Naming Conventions**  
Use consistent names for all symbols.  
Follow a pattern that describes the symbol's feature then its type. The recommended pattern is feature.type.ts  
Use dashes to separate words in the descriptive name when defining a component or in selectors.  
Use consistent names for all assets named after what they represent.  
All folder and sub folder names should always be lowercase.  
All TypeScript property-variable names should be camelCase.  
Ex:  
```
export class Product {
  constructor(
    public name: string, 
    public imageUrl: string, //here imageUrl has 2 words so we used camelCase
    ) 
	{
  }
}
```
Use upper camel case for class names.  
Use dashed-case or kebab-case for naming the element selectors of components.  
Ex:  
```
/* avoid */
@Component({
  selector: 'tohHeroButton',
  templateUrl: './hero-button.component.html'
})
export class HeroButtonComponent {}
```
good practice:  
```@Component({
  selector: 'toh-hero-button',
  templateUrl: './hero-button.component.html'
})
export class HeroButtonComponent {}
```

**Coding style Rule 4: Overall Structure:**  
Put all of the app's code in a folder named src.  
Consider creating a folder for a component when it has multiple accompanying files (.ts, .html, .css and .spec).  
Extract templates and styles into a separate file, when **more than 3 lines.**  
When importing modules, leave a space between the brackets and end with a semicolon ';'.  
Ex:  
```
import { Component, Input } from '@angular\core';
```
Always end statements with a semicolon ‘;’  

Use the @Input() and @Output() class decorators instead of the inputs and outputs properties of the @Directive and @Component metadata.  
Consider placing @Input() or @Output() on the same line as the property it decorates.  
Ex:  
```
/* avoid */
@Component({
  selector: 'toh-hero-button',
  template: `<button></button>`,
  inputs: [
    'label'
  ],
  outputs: [
    'heroChange'
  ]
})
export class HeroButtonComponent {
  heroChange = new EventEmitter<any>();
  label: string;
}
```
good practice:  
```
@Component({
  selector: 'toh-hero-button',
  template: `<button>{{label}}</button>`
})
export class HeroButtonComponent {
  @Output() heroChange = new EventEmitter<any>();
  @Input() label: string;
}
```
**Coding style Rule 5: Member sequence:**  
Place properties up top followed by methods.  
Place private members after public members, alphabetized.  

**Coding style Rule 6: Delegate complex component logic to services:**  
Limit logic in a component to only that required for the view. All other logic should be delegated to services.  
Move reusable logic to services and keep components simple and focused on their intended purpose.  

**Coding style Rule 7: Don't prefix output properties:**  
Name events without the prefix on.  
Name event handler methods with the prefix on followed by the event name.  
Ex:  
```
/* avoid */

@Component({
  selector: 'toh-hero',
  template: `...`
})
export class HeroComponent {
  @Output() onSavedTheDay = new EventEmitter<boolean>();
}
```
and avoid:  
```
<!-- avoid -->
<toh-hero (onSavedTheDay)="onSavedTheDay($event)"></toh-hero>
```
good practice:  
```
export class HeroComponent {
  @Output() savedTheDay = new EventEmitter<boolean>();
}
```

**Coding style Rule 8: About Services:**  
Use services as singletons within the same injector. Use them for sharing data and functionality.  
Create services with a single responsibility that is encapsulated by its context.  
Create a new service once the service begins to exceed that singular purpose.  
Refactor logic for making data operations and interacting with data to a service.  


**Coding style Rule 9: Commenting Conventions**  
Place the comment on a separate line before your code (and not at the end of a line of code).  
Insert one space between the comment delimiter (//) and the comment text.  
Begin comment text with an uppercase letter.  
End comment text with a period.  
Make sure to add a comment if your method/logic is not super clear.  
Ex: // This is a test comment.  

For a complete documentation style guide please refer to Angular documentation style guide available at:  
https://angular.io/guide/docs-style-guide  


**TESTING conventions:**  

Naming convention for tests:  
1) Name test specification files the same as the component they test.  
2) Name test specification files with a suffix of .spec.  
3) Name end-to-end test specification files after the feature they test with a suffix of .e2e-spec.  

Each test should validate one thing and one thing only; single use case.  
Tests can be run in any order; indepedent of other tests.  
Try and make test without dependencies (solitary) or provide mock data.  


**Git Guidelines**

Each feature/user-story will have it's separate branch to work on  
Branch Structure: Master - Staging - [Features]  

Before any commits are entered into master, they must be approved by a pull request.  
Each Pull-Request has to be approved at least by one reviewer that can be any of the team members.   

When working on user stories, ALWAYS branch off from staging into your own feature branch (feature/#19-add-toggle-button). Work on your story then after you run the test, make a pull request to merge to staging (develop). Code review will follow. At the end of the sprint (or release) a dedicated teammate will merge staging into master.   

Naming convention for branches:  
For tasks that add a feature use:		feature/...  
For tasks that restructure the cod use:		refactor/...  
For tasks  that fix a bug use: 			bug/...  
For tasks that don't follow any of the above:	issue/...  

When making git commits:  
Make each commit focused on one thing.  
Making refactoring commits should be as such Ex: “Refactored code for pull request #12 for issue#16”.  
Have relevant names and tag the user story it's connected to at the end Ex: “Added toggle button to google maps [Issue #16]” Where Issue #16 is the github issue.  

**Coding Linter:**  
The purpose of a linter is to assure a consistant coding style accross the application.  
Before you commit any code, the linter will run and check if your coding matches the expected style and if your code doesn't break the tests.  
To run the linter, stage all the files you want to commit and run npm run pre-commit.  
If you try commiting code and there is a husky error, that means that your code does not follow the standards.  
If you have any questions regarding the linter, contact Alessandro from this repo.  

Contributing
The following is a set of guidelines for contributing. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

Reporting Bugs
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

Styleguides
Git Commit Messages
Use the present tense ("Add feature" not "Added feature")
Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
Limit the first line to 72 characters or less
Reference issues and pull requests liberally after the first line

Naming Conventions
A folder and sub folder name should always start with small letters and the files belong the folders is always in PascalCase

Pascal case -> SampleFileName.js Ex: components/common/CustomButton.js

When importing modules, leave a space between the brackets and end with a semicolon

Ex: import { ScrollView, View, TouchableOpacity, KeyboardAvoidingView, ListView, AsyncStorage, Alert } from ‘react-native’;

Javascript variable names should be camel case

Camel Case -> var sampleVariable;

Layout Conventions
Always end statements with a semicolon ‘;’ Do NOT use setState() in the render() function

Commenting Conventions
Place the comment on a separate line, not at the end of a line of code.
Insert one space between the comment delimiter (//) and the comment text.
Begin comment text with an uppercase letter.
End comment text with a period.
Make sure to add a comment if your method/logic is not super clear
Ex: // This is a test comment.

Language Guidelines
Define variables using ‘const’ whenever you can, if not use ‘let’ over ‘var’ Props should not be changed as they are considered immutable

Git Guidelines
Each feature / user story will have it’s separate branch to work on
Branch Structure: Master - Staging - [Features]

Before any commits are entered into master, they must be approved by a pull request. Request any of us to review. When working on user stories, ALWAYS branch off from staging (i assume this is develop) into your own feature branch (feature/#19-add-toggle-button). Work on your story then after you run the test, make a pull request to merge to staging (develop). Code review will follow. At the end of the sprint (or release) a dedicated teammate will merge staging into master. When adding a bug to github, add:
Which branch and commit it was found on
How to replicate the bug
Which user story (github issue) it affects
When making git commits
Make each commit focused on one thing
Making refactoring commits should be as such Ex: “Refactored code for pull request #12 for issue#16”
Have relevant names and tag the user story it's connected to at the end Ex: “Added toggle button to google maps [Issue #16]” Where Issue #16 is the github issue
Coding Linter
The purpose of a linter is to assure a consistant coding style accross the application.
Before you commit any code, the linter will run and check if your coding matches the expected style and if your code doesn't break the tests
To run the linter, stage all the files you want to commit and run npm run pre-commit
If you try commiting code and there is a husky error, that means that your code does not follow the standards
If you have any questions regarding the linter, contact Alessandro from this repo
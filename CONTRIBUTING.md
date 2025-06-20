# Contributing to Zoldem

Thanks for your interest in improving Zoldem!

There are multiple opportunities to contribute at any level. It doesn't matter if you are just getting started with Rust and JavaScript or are the most weathered expert, we can use your help.

**No contribution is too small and all contributions are valued.**

This document will help you get started. **Do not let the document intimidate you**.
It should be considered as a guide to help you navigate the process.

If you contribute to this project, your contributions will be made to the project under the MIT license.

### Code of Conduct

The Zoldem project adheres to the [Rust Code of Conduct][rust-coc]. This code of conduct describes the _minimum_ behavior expected from all contributors.

### Ways to contribute

There are fundamentally three ways an individual can contribute:

1. **By opening an issue:** For example, if you believe that you have uncovered a bug in Zoldem, creating a new issue in the issue tracker is the way to report it.
2. **By adding context:** Providing additional context to existing issues, such as screenshots and code snippets to help resolve issues.
3. **By resolving issues:** Typically this is done in the form of either demonstrating that the issue reported is not a problem after all, or more often, by opening a pull request that fixes the underlying problem, in a concrete and reviewable manner.

**Anybody can participate in any stage of contribution**. We urge you to participate in the discussion around bugs and participate in reviewing PRs.

### Contributions Related to Spelling and Grammar

At this time, we will not be accepting contributions that only fix spelling or grammatical errors in documentation, code or elsewhere.

### Asking for help

If you have reviewed existing documentation and still have questions, or you are having problems, you can get help by **opening a discussion**. This repository comes with a discussions board where you can also ask for help. Click the "Discussions" tab at the top.

### Submitting a bug report

When filing a new bug report in the issue tracker, you will be presented with a basic form to fill out.

If you believe that you have uncovered a bug, please fill out the form to the best of your ability. Do not worry if you cannot answer every detail, just fill in what you can. Contributors will ask follow-up questions if something is unclear.

The most important pieces of information we need in a bug report are:

- The Rust version you are using for the backend
- The browser you are using for the frontend
- The platform you are on (Windows, macOS, Linux)
- Code snippets if this is happening in relation to game logic or API calls
- Concrete steps to reproduce the bug

In order to rule out the possibility of the bug being in your project, the code snippets should be as minimal as possible. It is better if you can reproduce the bug with a small snippet as opposed to an entire game session!

### Submitting a feature request

When adding a feature request in the issue tracker, you will be presented with a basic form to fill out.

Please include as detailed of an explanation as possible of the feature you would like, adding additional context if necessary.

If you have examples of other poker games or applications that have the feature you are requesting, please include them as well.

### Resolving an issue

Pull requests are the way concrete changes are made to the code, documentation, and dependencies of Zoldem.

Even tiny pull requests, like fixing wording, are greatly appreciated. Before making a large change, it is usually a good idea to first open an issue describing the change to solicit feedback and guidance. This will increase the likelihood of the PR getting merged.

Please also make sure that the following commands pass if you have changed the code:

**Backend (Rust):**
```sh
cd backend
cargo check
cargo test
cargo clippy
```

**Frontend (JavaScript):**
```sh
# Ensure your code follows consistent formatting
# Run any linting tools if available
```

#### Development Setup

To get started with development:

1. **Backend Setup:**
   ```sh
   cd backend
   cargo build
   cargo run
   ```

2. **Frontend Setup:**
   ```sh
   cd frontend
   # Open index.html in your browser or serve with a local server
   python -m http.server 8080  # or use your preferred method
   ```

#### Adding tests

If the change being proposed alters code, it is either adding new functionality to Zoldem, or fixing existing, broken functionality. In both of these cases, the pull request should include one or more tests to ensure that Zoldem does not regress in the future.

Types of tests include:

- **Unit tests**: Functions which have very specific tasks should be unit tested.
- **Integration tests**: For general purpose, far reaching functionality, integration tests should be added. The best way to add a new integration test is to look at existing ones and follow the style.
- **Game logic tests**: Poker game mechanics should be thoroughly tested to ensure fair play.

#### Running Individual tests

By default, `cargo test` runs all tests. To run specific tests:

```sh
cd backend
cargo test test_name
cargo test --package zoldem --lib game::tests::test_hand_evaluation
```

#### Commits

It is a recommended best practice to keep your changes as logically grouped as possible within individual commits. There is no limit to the number of commits any single pull request may have, and many contributors find it easier to review changes that are split across multiple commits.

That said, if you have a number of commits that are "checkpoints" and don't represent a single logical change, please squash those together.

##### Conventional Commits

Conventional Commits is a standardized format for writing commit messages that helps communicate the nature of changes clearly and consistently across a project. This format makes it easier to understand the history of changes, automate changelogs, and integrate with CI/CD workflows.

**Examples:**
- `feat: add Texas Hold'em variant`
- `feat(api): add player statistics endpoint`
- `fix(ui): correct card display in mobile view`
- `refactor: improve hand evaluation performance`
- `docs(readme): update game rules documentation`

**Common types:**
- `feat`: a new feature  
- `fix`: a bug fix  
- `docs`: documentation only changes  
- `style`: changes that do not affect meaning (white-space, formatting, etc.)  
- `refactor`: code changes that neither fix a bug nor add a feature  
- `test`: adding or updating tests  
- `chore`: maintenance tasks like tooling or build updates  

For more details and examples, refer to:
- [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- [Conventional Commit Messages (cheat sheet)](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13)

#### Opening the pull request

From within GitHub, opening a new pull request will present you with a template that should be filled out. Please try your best at filling out the details, but feel free to skip parts if you're not sure what to put.

#### Discuss and update

You will probably get feedback or requests for changes to your pull request. This is a big part of the submission process, so don't be discouraged! Some contributors may sign off on the pull request right away, others may have more detailed comments or feedback. This is a necessary part of the process in order to evaluate whether the changes are correct and necessary.

**Any community member can review a PR, so you might get conflicting feedback**. Keep an eye out for comments from code owners to provide guidance on conflicting feedback.

#### Reviewing pull requests

**Any Zoldem community member is welcome to review any pull request**.

All contributors who choose to review and provide feedback on pull requests have a responsibility to both the project and individual making the contribution. Reviews and feedback must be helpful, insightful, and geared towards improving the contribution as opposed to simply blocking it. If there are reasons why you feel the PR should not be merged, explain what those are. Do not expect to be able to block a PR from advancing simply because you say "no" without giving an explanation. Be open to having your mind changed. Be open to working _with_ the contributor to make the pull request better.

Reviews that are dismissive or disrespectful of the contributor or any other reviewers are strictly counter to the [Code of Conduct][rust-coc].

When reviewing a pull request, the primary goals are for the codebase to improve and for the person submitting the request to succeed. **Even if a pull request is not merged, the submitter should come away from the experience feeling like their effort was not unappreciated**. Every PR from a new contributor is an opportunity to grow the community.

##### Review a bit at a time

Do not overwhelm new contributors.

It is tempting to micro-optimize and make everything about relative performance, perfect grammar, or exact style matches. Do not succumb to that temptation.

Focus first on the most significant aspects of the change:

1. Does this change make sense for Zoldem?
2. Does this change make Zoldem better, even if only incrementally?
3. Are there clear bugs or larger scale issues that need attending?
4. Are the commit messages readable and correct? If it contains a breaking change, is it clear enough?
5. Does the change maintain game fairness and security?

Note that only **incremental** improvement is needed to land a PR. This means that the PR does not need to be perfect, only better than the status quo. Follow-up PRs may be opened to continue iterating.

When changes are necessary, _request_ them, do not _demand_ them, and **do not assume that the submitter already knows how to add a test or run the game locally**.

Specific performance optimization techniques, coding styles and conventions change over time. The first impression you give to a new contributor never does.

Nits (requests for small changes that are not essential) are fine, but try to avoid stalling the pull request. Most nits can typically be fixed by the Zoldem maintainers merging the pull request, but they can also be an opportunity for the contributor to learn a bit more about the project.

It is always good to clearly indicate nits when you comment, e.g.: `Nit: change foo() to bar(). But this is not blocking`.

If your comments were addressed but were not folded after new commits, or if they proved to be mistaken, please, [hide them][hiding-a-comment] with the appropriate reason to keep the conversation flow concise and relevant.

##### Be aware of the person behind the code

Be aware that _how_ you communicate requests and reviews in your feedback can have a significant impact on the success of the pull request. Yes, we may merge a particular change that makes Zoldem better, but the individual might just not want to have anything to do with Zoldem ever again. The goal is not just having good code.

##### Abandoned or stale pull requests

If a pull request appears to be abandoned or stalled, it is polite to first check with the contributor to see if they intend to continue the work before checking if they would mind if you took it over (especially if it just has nits left). When doing so, it is courteous to give the original contributor credit for the work they started, either by preserving their name and e-mail address in the commit log, or by using the `Author: ` or `Co-authored-by: ` metadata tag in the commits.

[rust-coc]: https://github.com/rust-lang/rust/blob/master/CODE_OF_CONDUCT.md
[hiding-a-comment]: https://help.github.com/articles/managing-disruptive-comments/#hiding-a-comment
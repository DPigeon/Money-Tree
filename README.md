[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/organizations/money-tree/projects)

# Money-Tree

[![CI Pipeline](https://github.com/DPigeon/Money-Tree/workflows/CI%20Pipeline/badge.svg)](https://github.com/DPigeon/Money-Tree/actions)
[![CD Pipeline](https://github.com/DPigeon/Money-Tree/workflows/CD%20Pipeline/badge.svg)](https://github.com/DPigeon/Money-Tree/actions)
</br>
</br>
A web platform that encourage good investing practices.

:mag:[UAT Environment](http://dev.money-tree.tech)

:rocket:[Production Environment](http://money-tree.tech)

## About This Repo

This is a monorepo that consists of two parts:
- The [Client](/client)
- The [Backend](/backend)

## Configuring the Linter

1. cd into the root directory of the project
2. Run the command

```
ln -s -f ../../hooks/pre-commit .git/hooks/pre-commit && chmod +x ./hooks/pre-commit
```

# create-fixture-repository

Quickly create git repositories with specified topologies. This is intended to act as a "reset button" for testing against arbitrarily complicated rebase or merge scenarios.

## Install

Install from npm:

```sh
npm install -g @smashwilson/create-fixture-repository
```

Or, run directly with npx:

```sh
npx @smashwilson/create-fixture-repository --help
```

## Use

Invoke `create-fixture-repository` in a directory to wipe any existing contents and replace it with a git repository of the chosen commit graph topology. :warning: `create-fixture-repository` will delete anything in the current working directory, so don't run it in a directory you care about. :warning:

Identify a repository template with `--fixture`. Choose from [the included ones](https://github.com/smashwilson/create-fixture-repository/tree/master/lib/fixtures) by name, or write your own in a standalone `.js` file and specify its full path. See `lib/fixtures/demo.ts` for an example that exercises the specification API.

If your fixture template uses `.push()`, specify the target remote with `--remote`. :warning: Be aware that `create-fixture-repository` will nuke any existing branches or data, so don't point it at anything you care about. :warning:

Use `--verbose` to see more detailed logs about the way that your repository is constructed.

When the repository is complete, its log structure will be dumped to your console.

```sh
$ create-fixture-repository --fixture demo --remote git@github.com:smashwilson/linear-history.git
·INFO: Repository structure created.

* b5c87c1 (HEAD -> master, origin/master) Qui elit adipisicing quis officia est pariatur.
* dd3e35a Nulla id voluptate laborum eu.
* 2c4909c Cillum sit tempor consequat non sint magna quis ut do sit et sunt.
* a98a13b Consequat nulla qui ex occaecat duis nisi aute id.
* fdc21a5 Fixed commit message here
| * a19a7af (something) Nostrud anim eiusmod excepteur irure Lorem.
| * db8f220 Officia excepteur tempor eiusmod nulla eiusmod fugiat ex id.
| | * 38b9e62 (third) Ea eu proident aliquip tempor sit amet est minim incididunt mollit non veniam velit.
| | * 4eaa13e Esse ea in labore quis dolor consectetur nulla magna velit eu pariatur.
| | *   9e5f3a0 Merge branch 'other' into third
| | |\
| | | * 502df73 (other) Magna amet esse consequat incididunt officia consequat ut sunt.
| | | * 85a770e Minim proident exercitation dolore est id ullamco.
| | | * ed87d98 Aliquip officia nostrud magna dolore minim consectetur labore velit pariatur.
| | |/
| |/|
| | * cc50259 Aute adipisicing laborum cupidatat labore laborum reprehenderit est voluptate ut officia ea.
| | * 4be6f63 Cupidatat ea sunt minim voluptate duis culpa.
| |/
| * a91f85f (origin/something) Ut quis culpa cillum nisi irure esse cupidatat ad adipisicing.
| * e926b1e Pariatur sit nulla cupidatat tempor elit sit exercitation officia sit quis et exercitation sit id.
|/
* 2c8b350 Non esse adipisicing officia irure dolor.
* 6a2c716 Nostrud nisi mollit irure esse eiusmod.
* 655b2db Commodo Lorem commodo esse nisi ullamco cillum tempor veniam sint ipsum nostrud magna ex.

·INFO: Repository remotes.

origin  git@github.com:smashwilson/linear-history.git (fetch)
origin  git@github.com:smashwilson/linear-history.git (push)
```

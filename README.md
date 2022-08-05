## Installing deps

```bash
yarn install
```

## Setting env vars

Required:

```bash
export ZEA_TELNET_HOST=127.0.0.1
export ZEA_TELNET_PORT=23

export ZEA_SESSION_ID=testSelect
export ZEA_SESSION_NAME=testSelect

setup json key file from account setting
```

Optional:

```bash
export DEBUG=zea:*

export ZEA_STREAMER_TYPE=mock
export ZEA_TEST_POINTS_FILE='C:\Box\R&D Services\Restricted\04_Research Trajectories\BROWER SRVY REVIEW\SURVEYLINK_MVP\Mockup\Setup Survey Points.txt'
export ZEA_STREAMER_TYPE=telnet
```

## Running

```bash
yarn run start
```

## Examples

For telnet session with HTTP server:

```bash
GET / HTTP/1.1
```

## Deploying Cloud Functions (not implemented)

new install and linking functions to firebase project
```bash
firebase use --add
firebase init functions
```

## Deploying Cloud Functions

```bash
cd functions
export FIREBASE_PROJECT_ID=some-project-id
yarn run deploy --project $FIREBASE_PROJECT_ID
```

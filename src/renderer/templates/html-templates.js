const base =
`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{{ title }}</title>
<style>
{{ styleBase }}
{{ styleMain }}
{{ styleExtra }}
</style>
</head>
<body>
{{ contents }}
</body>
</html>`

export {
  base
}

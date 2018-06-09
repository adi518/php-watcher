<?
  // https://stackoverflow.com/questions/4238433/php-how-to-create-a-newline-character
  // https://softwareengineering.stackexchange.com/questions/163004/what-is-the-opposite-of-initialize-or-init
  $sleep = 2;
  echo('[deploy] initialized' . PHP_EOL);
  echo("[deploy] async operations... (sleep $sleep" . 's)' . PHP_EOL);
  sleep($sleep);
  echo ('[deploy] finalized' . PHP_EOL);
?>

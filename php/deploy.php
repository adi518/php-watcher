<?
  // https://stackoverflow.com/questions/4238433/php-how-to-create-a-newline-character
  $sleep = 2;
  echo('[deploy] => initialized' . PHP_EOL);
  echo("[deploy] => async operations... (sleep $sleep" . 's)' . PHP_EOL);
  sleep($sleep);
  echo ('[deploy] => finalized' . PHP_EOL);
?>

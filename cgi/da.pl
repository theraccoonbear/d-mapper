#!/usr/bin/perl
use strict;
use warnings;
use Data::Dumper;
use DBI;
use Digest::SHA1;

my $dsn = 'dbi:SQLite:dbname=data/dmapper.db';
my $sth;
my $result;

my $dbh = DBI->connect(          
    $dsn, 
    "",                          
    "",                          
    { RaiseError => 1 },         
) or die $DBI::errstr;

my $schema = {};

$schema->{users} = <<__SQL;
CREATE TABLE IF NOT EXISTS users (
  `id` INT PRIMARY KEY,
  `username` VARCHAR(30) NOT NULL,
  `pass_hash` CHAR(40) NOT NULL,
  `email` VARCHAR(200),
  `created` datetime default current_timestamp
);
__SQL


$schema->{maps} = <<__SQL;
CREATE TABLE IF NOT EXISTS maps (
  `id` INT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `map` TEXT NOT NULL,
  `created` DATETIME DEFAULT current_timestamp
);
__SQL


sub tableExists {
  my $table_name = shift @_;
  $sth = $dbh->prepare("SELECT Count(*) FROM sqlite_master WHERE type='table' AND name='$table_name';");
  $sth->execute();
  $result = $sth->fetchrow();
  return $result >= 1;
}

my $rebuild = 1;

foreach my $key (sort keys %{$schema}) {
  
  if (tableExists($key) && !$rebuild) {
    print "Found \"$key\" table.\n";
  } else {
    print "No \"$key\" table...\n";
    my $sql = $schema->{$key};
    $sth = $dbh->prepare($sql);
    $sth->execute();
    print "...created\n";
    
  }
}

$sth->finish();
$dbh->disconnect();
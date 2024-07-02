<?php

namespace App\Service\DB;

use App\Service\DB\Utils\RepositoryUtil;
use Exception;

class Repository extends EntityManager
{
    protected ?string $tableName;

    public function __construct(string $tableName)
    {
        parent::__construct();
        $this->tableName = $tableName;
    }

//    ------------- CREATE -------------------------------------------------------

    /**
     * @throws Exception
     */
    public function insertOne(array $columnAndValues): bool|array
    {
        $sql = 'insert into ' . $this->tableName;
        $sql .= RepositoryUtil::formatMysqlConditionClause('insert', $columnAndValues);

        return $this->executeRequest($sql);
    }

//    ------------- READ -------------------------------------------------------

    /**
     * @throws Exception
     */
    public function findAll(): null|array
    {
        $sql = "select * from $this->tableName;";
        return $this->executeRequest($sql);
    }

    /**
     * @throws Exception
     */
    public function findBy(array $criteria): null|array
    {
        $sql = 'select * from ' . $this->tableName;
        $sql .= RepositoryUtil::formatMysqlConditionClause('where', $criteria);
        $sql .= ';';
        return $this->executeRequest($sql);
    }

    /**
     * @throws Exception
     */
    public function findOneBy(array $criteria): ?array
    {
        $sql = 'select * from ' . $this->tableName;
        $sql .= RepositoryUtil::formatMysqlConditionClause('where', $criteria);
        $sql .= ' limit 1;';

        $arrays = $this->executeRequest($sql);

        return $arrays ? $arrays[0] : null;
    }

//    ------------- UPDATE -------------------------------------------------------

    /**
     * @throws Exception
     */
    public function update(array $columnAndValues, array $conditions): bool
    {
        $sql = 'update ' . $this->tableName;
        $sql .= RepositoryUtil::formatMysqlConditionClause('set', $columnAndValues);
        $sql .= RepositoryUtil::formatMysqlConditionClause('where', $conditions);
        $sql .= ';';

        return $this->executeRequest($sql);
    }

//    ------------- DELETE -------------------------------------------------------

    /**
     * @throws Exception
     */
    public function delete(array $criteria): bool
    {
        $sql = 'delete from ' . $this->tableName;
        $sql .= RepositoryUtil::formatMysqlConditionClause('where', $criteria);
        $sql .= ';';

        return $this->executeRequest($sql);
    }
}
import React, { useState, useCallback, useEffect } from 'react';
import { getListSkill } from 'services/skill.service';
import SkillFilter from 'pages/Skill/components/table/SkillFilter';
import SkillTable from 'pages/Skill/components/table/SkillTable';
import { useFormContext } from 'react-hook-form';
import { defaultPaging, defaultParams } from 'utils/helpers';

const SkillPage = ({ field, hiddenActionRow = false, onSelect }) => {
  const methods = useFormContext();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadSkill = useCallback(() => {
    setLoading(true);
    getListSkill(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadSkill, [loadSkill]);

  return (
    <React.Fragment>
      <div className={!hiddenActionRow && 'bw_main_wrapp'}>
        <SkillFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
          onClear={() => setParams(defaultParams)}
        />
        <SkillTable
          hiddenActionRow={hiddenActionRow}
          fieldCheck='skill_id'
          defaultDataSelect={Object.values(methods.watch(field) ?? {})}
          loading={loading}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onRefresh={loadSkill}
          onSelect={onSelect}
        />
      </div>
    </React.Fragment>
  );
};

export default SkillPage;

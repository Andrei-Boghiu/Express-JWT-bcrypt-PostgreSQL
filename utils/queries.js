module.exports = calculateColumnAge = (columnName, alias = columnName) => {
    return `TRIM(
              COALESCE(
                  NULLIF(EXTRACT(YEAR FROM AGE(NOW(), ${columnName}))::TEXT || ' years', '0 years'), 
                  ''
              ) || ' ' || 
              COALESCE(
                  NULLIF(EXTRACT(MONTH FROM AGE(NOW(), ${columnName}))::TEXT || ' months', '0 months'), 
                  ''
              ) || ' ' || 
              COALESCE(
                  NULLIF(EXTRACT(DAY FROM AGE(NOW(), ${columnName}))::TEXT || ' days', '0 days'), 
                  ''
              ) || ' ' || 
              COALESCE(
                  NULLIF(EXTRACT(HOUR FROM AGE(NOW(), ${columnName}))::TEXT || ' hours', '0 hours'), 
                  ''
              ) || ' ' || 
              COALESCE(
                  NULLIF(EXTRACT(MINUTE FROM AGE(NOW(), ${columnName}))::TEXT || ' minutes', '0 minutes'), 
                  ''
              )
          ) AS "${alias}"`;
};

import {
  Combobox,
  Loader,
  TextInput,
  Text,
  useCombobox,
} from '@mantine/core';
import {MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import ArticleSearchResult from '@/components/generic/ArticleSearchResult';
import { useNavigate } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import {useSearchNews} from '@/hooks/queries/search.query.ts';
import type { SearchedNewsResult } from '@/shared/types/news/SearchedNews.ts';

const Searchbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedSearchText] = useDebouncedValue(query, 300);
  const { data, isFetching, error } = useSearchNews(debouncedSearchText);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const articles = query.trim().length >= 2 ? (data?.data ?? []) : [];


  return (
      <Combobox
        store={combobox}
        onOptionSubmit={(newsId) => {
          navigate(`/news/${newsId}`);
          combobox.closeDropdown();
        }}

      >
        <Combobox.Target>
          <TextInput
            placeholder='Search articles, entities, topics...'
            w={{ base: '100%', sm: 365 }}
            size='md'
            radius='md'
            leftSection={<MagnifyingGlassIcon size={18} />}
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
              console.log(query);
              combobox.resetSelectedOption();
              combobox.openDropdown();
            }}
            rightSection={isFetching ? <Loader size='xs' /> : null}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                combobox.selectNextOption();
              }
            }}
          />
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>
            {query.trim().length < 2 ? (
              <Combobox.Empty>
                Type at least 2 characters to search
              </Combobox.Empty>
            ) : isFetching ? (
              <Combobox.Empty>Searching...</Combobox.Empty>
            ) : articles.length > 0 ? (
              articles.map((article:SearchedNewsResult) => (
                <Combobox.Option key={article.id} value={article.id} p='sm'>
                  <ArticleSearchResult article={article} />
                </Combobox.Option>
              ))
            ) : (
              <Combobox.Empty>No articles found</Combobox.Empty>
            )}
          </Combobox.Options>

          {query.trim().length >= 2 && articles.length > 0 && (
            <Combobox.Footer>
              <Text size='sm' c='dimmed' ta='center' py='xs'>
                View all results
              </Text>
            </Combobox.Footer>
          )}
        </Combobox.Dropdown>
      </Combobox>
  );
};

export default Searchbar;

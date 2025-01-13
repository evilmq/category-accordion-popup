import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Материалы и оборудование',
    children: [
      { id: '2', name: 'Блок розеток' },
      { id: '3', name: 'Фитинги к трубам полимерным для систем водопровода/отопления/газопровода (внутренние сети)' },
      { id: '4', name: 'Работа номинированная' },
      { id: '5', name: 'Светофоры' },
      { id: '6', name: 'Серверы' },
      { id: '7', name: 'Система безопасности' },
      { id: '8', name: 'Устройства этажные распределительные модульные и короба к ним(не использовать)' },
      { id: '9', name: 'Насосное оборудование' },
      { id: '10', name: 'Система грязезащитная' },
      { id: '11', name: 'Вентиляционное оборудование' },
    ]
  },
  {
    id: '12',
    name: 'Строительные работы',
    children: [
      { id: '13', name: 'Земляные работы' },
      { id: '14', name: 'Бетонные работы' },
      { id: '15', name: 'Кровельные работы' },
      { id: '16', name: 'Отделочные работы' },
      { id: '17', name: 'Фасадные работы' },
    ]
  },
  {
    id: '18',
    name: 'Инженерные системы',
    children: [
      {
        id: '19',
        name: 'Отопление',
        children: [
          { id: '20', name: 'Радиаторы' },
          { id: '21', name: 'Котлы' },
          { id: '22', name: 'Трубы' },
        ]
      },
      {
        id: '23',
        name: 'Вентиляция',
        children: [
          { id: '24', name: 'Воздуховоды' },
          { id: '25', name: 'Вентиляторы' },
          { id: '26', name: 'Фильтры' },
        ]
      },
      {
        id: '27',
        name: 'Водоснабжение',
        children: [
          { id: '28', name: 'Трубы ПВХ' },
          { id: '29', name: 'Фитинги' },
          { id: '30', name: 'Насосы' },
        ]
      },
    ]
  },
  {
    id: '31',
    name: 'Электрооборудование',
    children: [
      { id: '32', name: 'Кабели и провода' },
      { id: '33', name: 'Автоматы защиты' },
      { id: '34', name: 'Щиты электрические' },
      { id: '35', name: 'Светильники' },
    ]
  },
  {
    id: '36',
    name: 'Отделочные материалы',
    children: [
      {
        id: '37',
        name: 'Напольные покрытия',
        children: [
          { id: '38', name: 'Ламинат' },
          { id: '39', name: 'Паркет' },
          { id: '40', name: 'Линолеум' },
        ]
      },
      {
        id: '41',
        name: 'Стеновые материалы',
        children: [
          { id: '42', name: 'Обои' },
          { id: '43', name: 'Краски' },
          { id: '44', name: 'Штукатурка' },
        ]
      },
    ]
  }
];

interface CategoryItemProps {
  category: Category;
  level?: number;
  selectedCategories: Set<string>;
  onToggleCategory: (categoryId: string) => void;
  expandedCategories: Set<string>;
  onToggleExpand: (categoryId: string) => void;
  searchTerm: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  level = 0,
  selectedCategories,
  onToggleCategory,
  expandedCategories,
  onToggleExpand,
  searchTerm
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);

  // Check if this category or any of its children match the search term
  const matchesSearch = (cat: Category): boolean => {
    if (cat.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
    if (cat.children) {
      return cat.children.some(child => matchesSearch(child));
    }
    return false;
  };

  // If there's a search term and neither this category nor its children match, don't render
  if (searchTerm && !matchesSearch(category)) {
    return null;
  }

  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 py-1 hover:bg-gray-50 ${level > 0 ? 'ml-6' : ''}`}
      >
        {hasChildren && (
          <button
            onClick={() => onToggleExpand(category.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        <Checkbox
          id={category.id}
          checked={selectedCategories.has(category.id)}
          onCheckedChange={() => onToggleCategory(category.id)}
        />
        <label
          htmlFor={category.id}
          className="text-sm text-gray-700 cursor-pointer flex-1 hover:text-gray-900"
        >
          {category.name}
        </label>
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedCategories={selectedCategories}
              onToggleCategory={onToggleCategory}
              expandedCategories={expandedCategories}
              onToggleExpand={onToggleExpand}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CategoryPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoryPopup: React.FC<CategoryPopupProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['1']));

  const handleToggleCategory = (categoryId: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const handleToggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Function to get all category IDs (including children)
  const getAllCategoryIds = (cats: Category[]): string[] => {
    let ids: string[] = [];
    cats.forEach(cat => {
      ids.push(cat.id);
      if (cat.children) {
        ids = [...ids, ...getAllCategoryIds(cat.children)];
      }
    });
    return ids;
  };

  const handleSelectAll = () => {
    const allIds = getAllCategoryIds(categories);
    // If all categories are already selected, deselect all
    if (allIds.every(id => selectedCategories.has(id))) {
      setSelectedCategories(new Set());
    } else {
      // Otherwise, select all categories
      setSelectedCategories(new Set(allIds));
    }
  };

  const handleCollapseAll = () => {
    setExpandedCategories(new Set());
  };

  // Determine if all categories are selected
  const allCategoriesSelected = useMemo(() => {
    const allIds = getAllCategoryIds(categories);
    return allIds.every(id => selectedCategories.has(id));
  }, [selectedCategories]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Категории</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Поиск категорий"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-between items-center mb-2 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={allCategoriesSelected}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-gray-700 cursor-pointer">
                Выбрать все
              </label>
            </div>
            <button
              onClick={handleCollapseAll}
              className="text-blue-500 hover:text-blue-600"
            >
              Свернуть все
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto border rounded-md p-2">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                expandedCategories={expandedCategories}
                onToggleExpand={handleToggleExpand}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            ОТМЕНИТЬ
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            СОХРАНИТЬ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryPopup;

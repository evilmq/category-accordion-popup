import React, { useState } from 'react';
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
  }
];

interface CategoryItemProps {
  category: Category;
  level?: number;
  selectedCategories: Set<string>;
  onToggleCategory: (categoryId: string) => void;
  expandedCategories: Set<string>;
  onToggleExpand: (categoryId: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  level = 0,
  selectedCategories,
  onToggleCategory,
  expandedCategories,
  onToggleExpand
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);

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

  const handleSelectAll = () => {
    const allIds = new Set<string>();
    const getAllIds = (cats: Category[]) => {
      cats.forEach(cat => {
        allIds.add(cat.id);
        if (cat.children) {
          getAllIds(cat.children);
        }
      });
    };
    getAllIds(categories);
    setSelectedCategories(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Категории</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Категории"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-between items-center mb-2 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={selectedCategories.size > 0}
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
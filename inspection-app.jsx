import React, { useState } from 'react';
import { Input, Card, Progress, Tag, Button, Upload, Select, Badge, Segmented } from 'antd';
import { SearchOutlined, PlusOutlined, ArrowLeftOutlined, FilterOutlined } from '@ant-design/icons';
import { initialTechPlaces } from './mockData';

const InspectionApp = () => {
  const [currentScreen, setCurrentScreen] = useState('main'); // main, techPlaces, stages, defects
  const [techPlaces, setTechPlaces] = useState(initialTechPlaces);
  const [selectedTechPlace, setSelectedTechPlace] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showOnlyDefects, setShowOnlyDefects] = useState(false);

  // Получение статуса тех.места
  const getTechPlaceStatus = (techPlace) => {
    const hasInspectedStages = techPlace.stages.some(s => s.inspected);
    if (!hasInspectedStages) return 'not-inspected';
    
    const hasDefects = techPlace.stages.some(s => 
      s.defects.some(d => d.severity !== 'none')
    );
    return hasDefects ? 'has-defects' : 'no-defects';
  };

  // Получение цвета статуса
  const getStatusColor = (status) => {
    switch(status) {
      case 'no-defects': return '#52c41a';
      case 'has-defects': return '#ff4d4f';
      case 'not-inspected': return '#d9d9d9';
      default: return '#d9d9d9';
    }
  };

  // Подсчет прогресса
  const getProgress = (techPlace) => {
    const total = techPlace.stages.length;
    const inspected = techPlace.stages.filter(s => s.inspected).length;
    return { inspected, total, percent: Math.round((inspected / total) * 100) };
  };

  // Подсчет дефектов для этапа
  const getDefectCount = (stage) => {
    return stage.defects.filter(d => d.severity !== 'none').length;
  };

  // Получение статуса этапа
  const getStageStatus = (stage) => {
    const defectCount = getDefectCount(stage);
    if (defectCount > 0) return 'has-defects';
    if (stage.inspected) return 'no-defects';
    return 'not-inspected';
  };

  // Фильтрация тех.мест
  const filteredTechPlaces = techPlaces.filter(tp => {
    const matchesSearch = tp.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === 'all' || tp.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Получение уникальных типов
  const uniqueTypes = ['all', ...new Set(techPlaces.map(tp => tp.type))];

  // Обработчик загрузки фото
  const handlePhotoUpload = (defectId, file) => {
    const updatedTechPlaces = techPlaces.map(tp => {
      if (tp.id === selectedTechPlace.id) {
        return {
          ...tp,
          stages: tp.stages.map(stage => {
            if (stage.id === selectedStage.id) {
              return {
                ...stage,
                defects: stage.defects.map(defect => {
                  if (defect.id === defectId) {
                    return {
                      ...defect,
                      photos: [...defect.photos, { url: URL.createObjectURL(file), file }]
                    };
                  }
                  return defect;
                })
              };
            }
            return stage;
          })
        };
      }
      return tp;
    });
    
    setTechPlaces(updatedTechPlaces);
    const updatedTechPlace = updatedTechPlaces.find(tp => tp.id === selectedTechPlace.id);
    const updatedStage = updatedTechPlace.stages.find(s => s.id === selectedStage.id);
    setSelectedTechPlace(updatedTechPlace);
    setSelectedStage(updatedStage);
    return false;
  };

  // Обновление критичности дефекта
  const updateDefectSeverity = (defectId, severity) => {
    const updatedTechPlaces = techPlaces.map(tp => {
      if (tp.id === selectedTechPlace.id) {
        return {
          ...tp,
          stages: tp.stages.map(stage => {
            if (stage.id === selectedStage.id) {
              return {
                ...stage,
                defects: stage.defects.map(defect => 
                  defect.id === defectId ? { ...defect, severity } : defect
                )
              };
            }
            return stage;
          })
        };
      }
      return tp;
    });
    
    setTechPlaces(updatedTechPlaces);
    const updatedTechPlace = updatedTechPlaces.find(tp => tp.id === selectedTechPlace.id);
    const updatedStage = updatedTechPlace.stages.find(s => s.id === selectedStage.id);
    setSelectedTechPlace(updatedTechPlace);
    setSelectedStage(updatedStage);
  };

  // Обновление комментария
  const updateDefectComment = (defectId, comment) => {
    const updatedTechPlaces = techPlaces.map(tp => {
      if (tp.id === selectedTechPlace.id) {
        return {
          ...tp,
          stages: tp.stages.map(stage => {
            if (stage.id === selectedStage.id) {
              return {
                ...stage,
                defects: stage.defects.map(defect => 
                  defect.id === defectId ? { ...defect, comment } : defect
                )
              };
            }
            return stage;
          })
        };
      }
      return tp;
    });
    
    setTechPlaces(updatedTechPlaces);
    const updatedTechPlace = updatedTechPlaces.find(tp => tp.id === selectedTechPlace.id);
    const updatedStage = updatedTechPlace.stages.find(s => s.id === selectedStage.id);
    setSelectedTechPlace(updatedTechPlace);
    setSelectedStage(updatedStage);
  };

  // Завершить этап
  const completeStage = () => {
    const updatedTechPlaces = techPlaces.map(tp => {
      if (tp.id === selectedTechPlace.id) {
        return {
          ...tp,
          stages: tp.stages.map(stage => {
            if (stage.id === selectedStage.id) {
              return {
                ...stage,
                inspected: true
              };
            }
            return stage;
          })
        };
      }
      return tp;
    });
    
    setTechPlaces(updatedTechPlaces);
    setCurrentScreen('stages');
  };

  // Фильтрация дефектов
  const getFilteredDefects = () => {
    if (!showOnlyDefects) return selectedStage.defects;
    return selectedStage.defects.filter(d => d.severity !== 'none');
  };

  // Главный экран
  const MainScreen = () => (
    <div style={{ 
      padding: '24px', 
      maxWidth: '800px', 
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Card style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
        <h1 style={{ marginBottom: '32px', fontSize: '28px' }}>Система осмотра оборудования</h1>
        <p style={{ marginBottom: '32px', fontSize: '16px', color: '#666' }}>
          Добро пожаловать в систему осмотра технических мест
        </p>
        <Button 
          type="primary" 
          size="large" 
          onClick={() => setCurrentScreen('techPlaces')}
          style={{ minWidth: '200px', height: '50px', fontSize: '18px' }}
        >
          Заполнить
        </Button>
      </Card>
    </div>
  );

  // Экран списка техмест (для исполнителя)
  const TechPlacesScreen = () => (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => setCurrentScreen('main')}
        style={{ marginBottom: '16px' }}
      >
        На главную
      </Button>
      
      <h1 style={{ marginBottom: '24px' }}>Технические места</h1>
      
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <Input
          placeholder="Поиск по наименованию"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 250 }}
          placeholder="Фильтр по типу"
        >
          {uniqueTypes.map(type => (
            <Select.Option key={type} value={type}>
              {type === 'all' ? 'Все типы' : type}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTechPlaces.map(techPlace => {
          const status = getTechPlaceStatus(techPlace);
          const progress = getProgress(techPlace);
          const totalDefects = techPlace.stages.reduce((sum, s) => sum + s.defects.filter(d => d.severity !== 'none').length, 0);
          
          return (
            <Card
              key={techPlace.id}
              hoverable
              onClick={() => {
                setSelectedTechPlace(techPlace);
                setCurrentScreen('stages');
              }}
              style={{ 
                cursor: 'pointer',
                borderLeft: `6px solid ${getStatusColor(status)}`,
                transition: 'all 0.3s'
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{techPlace.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {totalDefects > 0 && <Tag color="red">Дефектов: {totalDefects}</Tag>}
                    <Tag color="blue">{techPlace.type}</Tag>
                  </div>
                </div>
                
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    <span>Прогресс осмотра</span>
                    <span>{progress.inspected} из {progress.total}</span>
                  </div>
                  <Progress 
                    percent={progress.percent} 
                    strokeColor={status === 'has-defects' ? '#ff4d4f' : '#52c41a'}
                    showInfo={false}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Экран списка этапов (для исполнителя)
  const StagesScreen = () => (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => setCurrentScreen('techPlaces')}
        style={{ marginBottom: '16px' }}
      >
        Назад
      </Button>
      
      <h1 style={{ marginBottom: '24px' }}>{selectedTechPlace.name}</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {selectedTechPlace.stages.map(stage => {
          const status = getStageStatus(stage);
          const defectCount = getDefectCount(stage);
          
          return (
            <Card
              key={stage.id}
              hoverable
              onClick={() => {
                setSelectedStage(stage);
                setCurrentScreen('defects');
              }}
              style={{ 
                cursor: 'pointer',
                borderLeft: `6px solid ${getStatusColor(status)}`,
                transition: 'all 0.3s'
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '8px', fontSize: '18px' }}>
                    {stage.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Tag color={stage.inspected ? 'default' : 'default'} style={{ 
                      backgroundColor: stage.inspected ? 'transparent' : '#f0f0f0',
                      color: stage.inspected ? '#000' : '#8c8c8c',
                      border: stage.inspected ? '1px solid #d9d9d9' : 'none'
                    }}>
                      {stage.inspected ? 'Осмотрено' : 'Не осмотрено'}
                    </Tag>
                    
                    {defectCount > 0 ? (
                      <Tag color="red">Дефектов: {defectCount}</Tag>
                    ) : stage.inspected ? (
                      <Tag color="green">Нет дефектов</Tag>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Экран списка дефектов (для исполнителя)
  const DefectsScreen = () => {
    const filteredDefects = getFilteredDefects();
    
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => setCurrentScreen('stages')}
          style={{ marginBottom: '16px' }}
        >
          Назад
        </Button>
        
        <h1 style={{ marginBottom: '16px' }}>{selectedStage.name}</h1>
        
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button 
            type={showOnlyDefects ? 'primary' : 'default'}
            icon={<FilterOutlined />}
            onClick={() => setShowOnlyDefects(!showOnlyDefects)}
          >
            Только с дефектами
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {filteredDefects.map(defect => (
            <Card key={defect.id} style={{ borderRadius: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ margin: 0 }}>{defect.name}</h3>
                
                <div>
                  <div style={{ marginBottom: '8px', fontWeight: '500' }}>Критичность:</div>
                  <Segmented
                    value={defect.severity}
                    onChange={(value) => updateDefectSeverity(defect.id, value)}
                    block
                    options={[
                      { label: 'Нет', value: 'none' },
                      { label: 'Низкий', value: 'low' },
                      { label: 'Средний', value: 'medium' },
                      { label: 'Высокий', value: 'high' },
                    ]}
                    className={`severity-segmented severity-${defect.severity}`}
                  />
                </div>

                <div>
                  <div style={{ marginBottom: '8px', fontWeight: '500' }}>Фото:</div>
                  <Upload
                    listType="picture-card"
                    fileList={defect.photos.map((photo, idx) => ({
                      uid: idx,
                      name: `photo-${idx}`,
                      status: 'done',
                      url: photo.url,
                    }))}
                    beforeUpload={(file) => handlePhotoUpload(defect.id, file)}
                    accept="image/*"
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Загрузить</div>
                    </div>
                  </Upload>
                </div>

                <div>
                  <div style={{ marginBottom: '8px', fontWeight: '500' }}>Комментарий:</div>
                  <Input.TextArea
                    value={defect.comment}
                    onChange={(e) => updateDefectComment(defect.id, e.target.value)}
                    placeholder="Введите комментарий"
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button 
          type="primary" 
          size="large" 
          block
          onClick={completeStage}
        >
          Завершить этап
        </Button>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <style>{`
        .severity-segmented.severity-low .ant-segmented-item-selected {
          background-color: #fffbe6 !important;
          color: #d4b106 !important;
          font-weight: 600;
        }
        .severity-segmented.severity-medium .ant-segmented-item-selected {
          background-color: #fff7e6 !important;
          color: #d46b08 !important;
          font-weight: 600;
        }
        .severity-segmented.severity-high .ant-segmented-item-selected {
          background-color: #fff1f0 !important;
          color: #cf1322 !important;
          font-weight: 600;
        }
      `}</style>
      {currentScreen === 'main' && <MainScreen />}
      {currentScreen === 'techPlaces' && <TechPlacesScreen />}
      {currentScreen === 'stages' && <StagesScreen />}
      {currentScreen === 'defects' && <DefectsScreen />}
    </div>
  );
};

export default InspectionApp;

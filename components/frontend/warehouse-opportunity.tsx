"use client"

import { TrendingUp, ArrowRight, Building2, Clock, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const opportunities = {
  rent: [
    {
      id: 1,
      title: "深圳龙岗5000㎡标准仓库急租",
      location: "广东省深圳市龙岗区",
      area: "5000㎡",
      price: "32元/㎡/月",
      publishTime: "2小时前",
      views: 128,
      isHot: true,
      tags: ["急租", "可分租"],
    },
    {
      id: 2,
      title: "广州黄埔恒温仓储出租",
      location: "广东省广州市黄埔区",
      area: "3000㎡",
      price: "48元/㎡/月",
      publishTime: "5小时前",
      views: 86,
      isHot: false,
      tags: ["恒温", "近港口"],
    },
    {
      id: 3,
      title: "东莞虎门大型堆场招租",
      location: "广东省东莞市虎门镇",
      area: "15000㎡",
      price: "15元/㎡/月",
      publishTime: "1天前",
      views: 256,
      isHot: true,
      tags: ["露天", "大面积"],
    },
  ],
  demand: [
    {
      id: 1,
      title: "某央企求租广州周边3000㎡仓储",
      location: "广东省广州市",
      area: "3000㎡",
      budget: "30-40元/㎡/月",
      publishTime: "1小时前",
      views: 45,
      isHot: true,
      tags: ["长期", "央企"],
    },
    {
      id: 2,
      title: "物流公司寻找深圳冷链仓库",
      location: "广东省深圳市",
      area: "2000㎡",
      budget: "面议",
      publishTime: "3小时前",
      views: 32,
      isHot: false,
      tags: ["冷链", "急需"],
    },
  ],
  entrust: [
    {
      id: 1,
      title: "钢材物资委托运营招标",
      content: "某项目剩余钢材约2000吨，寻求专业运营方",
      estimatedValue: "约500万元",
      publishTime: "今天",
      deadline: "2024年3月15日",
      isHot: true,
    },
    {
      id: 2,
      title: "建筑周转材料托管服务",
      content: "脚手架、模板等周转材料，需要专业存储及调配",
      estimatedValue: "约200万元",
      publishTime: "昨天",
      deadline: "2024年3月20日",
      isHot: false,
    },
  ],
}

export function WarehouseOpportunity() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">仓储商机</h2>
        </div>
        <Button variant="link" className="text-primary">
          更多商机
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <Tabs defaultValue="rent" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="rent">出租信息</TabsTrigger>
          <TabsTrigger value="demand">求租需求</TabsTrigger>
          <TabsTrigger value="entrust">委托运营</TabsTrigger>
        </TabsList>

        <TabsContent value="rent">
          <div className="space-y-3">
            {opportunities.rent.map((item) => (
              <Card key={item.id} className="group hover:shadow-md transition-all hover:border-primary/50 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.isHot && (
                          <Badge className="bg-destructive text-destructive-foreground">热门</Badge>
                        )}
                        <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{item.location}</span>
                        <span>{item.area}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{item.price}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.publishTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demand">
          <div className="space-y-3">
            {opportunities.demand.map((item) => (
              <Card key={item.id} className="group hover:shadow-md transition-all hover:border-primary/50 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.isHot && (
                          <Badge className="bg-accent text-accent-foreground">优质</Badge>
                        )}
                        <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{item.location}</span>
                        <span>需求面积：{item.area}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-accent">{item.budget}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.publishTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="entrust">
          <div className="space-y-3">
            {opportunities.entrust.map((item) => (
              <Card key={item.id} className="group hover:shadow-md transition-all hover:border-primary/50 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.isHot && (
                          <Badge className="bg-chart-3 text-white">招标</Badge>
                        )}
                        <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>截止日期：{item.deadline}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{item.estimatedValue}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        发布于：{item.publishTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
